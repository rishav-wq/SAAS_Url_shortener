import Link from '../models/Link.js';
import Click from '../models/click.js';
import { nanoid } from 'nanoid';
import useragent from 'useragent';
import qr from 'qrcode';

// --- Helper for Async Click Logging ---
const logClick = async (linkId, ipAddress, userAgentString) => {
    try {
        const agent = useragent.parse(userAgentString);
        const click = new Click({
            linkId,
            ipAddress,
            userAgent: userAgentString,
        });
        await click.save();
        console.log(`Click logged for linkId: ${linkId}`);
    } catch (error) {
        console.error(`Error logging click for linkId ${linkId}:`, error);
    }
};

// --- Route Handlers ---

export const createLink = async (req, res) => {
    const { originalUrl, customAlias, expiresAt } = req.body;
    const userId = req.userId;

    if (!originalUrl) {
        return res.status(400).json({ message: 'Original URL is required' });
    }

    try {
        let shortId = customAlias;
        if (shortId) {
            const existing = await Link.findOne({ shortId });
            if (existing) {
                return res.status(400).json({ message: 'Custom alias already in use' });
            }
        } else {
            let generated = false;
            while (!generated) {
                shortId = nanoid(7);
                const existing = await Link.findOne({ shortId });
                if (!existing) {
                    generated = true;
                }
            }
        }

        const newLink = new Link({
            originalUrl,
            shortId,
            userId,
            expiresAt: expiresAt ? new Date(expiresAt) : null,
        });

        await newLink.save();
        const shortUrl = `${req.protocol}://${req.get('host')}/${shortId}`;

        res.status(201).json({ ...newLink.toObject(), shortUrl });
    } catch (error) {
        console.error("Create Link Error:", error);
        res.status(500).json({ message: 'Server error creating link' });
    }
};

export const getLinks = async (req, res) => {
    const userId = req.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const searchQuery = req.query.search || '';
    const skip = (page - 1) * limit;

    try {
        const query = { userId };

        if (searchQuery) {
            query.$or = [
                { originalUrl: { $regex: searchQuery, $options: 'i' } },
                { shortId: { $regex: searchQuery, $options: 'i' } }
            ];
        }

        const links = await Link.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalLinks = await Link.countDocuments(query);
        const linkIds = links.map(link => link._id);

        const clickCounts = await Click.aggregate([
            { $match: { linkId: { $in: linkIds } } },
            { $group: { _id: '$linkId', count: { $sum: 1 } } }
        ]);

        const linksWithCounts = links.map(link => {
            const clickData = clickCounts.find(c => c._id.equals(link._id));
            return {
                ...link.toObject(),
                totalClicks: clickData ? clickData.count : 0,
                shortUrl: `${req.protocol}://${req.get('host')}/${link.shortId}`,
                isExpired: link.expiresAt && new Date() > link.expiresAt,
            };
        });

        res.json({
            links: linksWithCounts,
            currentPage: page,
            totalPages: Math.ceil(totalLinks / limit),
            totalLinks
        });

    } catch (error) {
        console.error("Get Links Error:", error);
        res.status(500).json({ message: 'Server error fetching links' });
    }
};

export const redirectLink = async (req, res) => {
    const { shortId } = req.params;

    try {
        const link = await Link.findOne({ shortId });

        if (!link) {
            return res.status(404).send('Link not found');
        }

        if (link.expiresAt && new Date() > link.expiresAt) {
            return res.status(410).send('Link expired');
        }

        res.redirect(302, link.originalUrl);

        const ipAddress = req.ip || req.socket.remoteAddress || req.headers['x-forwarded-for']?.split(',').shift();
        const userAgentString = req.headers['user-agent'];
        logClick(link._id, ipAddress, userAgentString);

    } catch (error) {
        console.error("Redirect Error:", error);
        if (!res.headersSent) {
            res.status(500).send('Server error');
        }
    }
};

export const getLinkStats = async (req, res) => {
    const { linkId } = req.params;
    const userId = req.userId;

    try {
        const link = await Link.findOne({ _id: linkId, userId });
        if (!link) {
            return res.status(404).json({ message: 'Link not found or not owned by user' });
        }

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const clicksOverTime = await Click.aggregate([
            { $match: { linkId: link._id, timestamp: { $gte: thirtyDaysAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        const deviceBrowserStats = await Click.aggregate([
            { $match: { linkId: link._id } },
            { $project: { userAgent: 1 } },
            { $group: { _id: "$userAgent", count: { $sum: 1 } } }
        ]);

        const parsedStats = { browsers: {}, os: {}, devices: {} };
        deviceBrowserStats.forEach(item => {
            const agent = useragent.lookup(item._id);
            const browser = agent.family;
            const os = agent.os.family;
            const device = agent.device.family;

            parsedStats.browsers[browser] = (parsedStats.browsers[browser] || 0) + item.count;
            parsedStats.os[os] = (parsedStats.os[os] || 0) + item.count;
            parsedStats.devices[device] = (parsedStats.devices[device] || 0) + item.count;
        });

        res.json({
            clicksOverTime,
            deviceBrowserStats: parsedStats
        });

    } catch (error) {
        console.error("Get Link Stats Error:", error);
        res.status(500).json({ message: 'Server error fetching link statistics' });
    }
};

export const getLinkQRCode = async (req, res) => {
    const { linkId } = req.params;
    const userId = req.userId;

    try {
        const link = await Link.findOne({ _id: linkId, userId });
        if (!link) {
            return res.status(404).json({ message: 'Link not found or not owned by user' });
        }

        const shortUrl = `${req.protocol}://${req.get('host')}/${link.shortId}`;
        const qrCodeDataURL = await qr.toDataURL(shortUrl);

        res.json({ qrCodeDataURL });

    } catch (error) {
        console.error("QR Code Generation Error:", error);
        res.status(500).json({ message: 'Server error generating QR code' });
    }
};
