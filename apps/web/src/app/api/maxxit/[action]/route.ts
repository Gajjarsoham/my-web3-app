
import { NextRequest, NextResponse } from 'next/server';

// In-memory store for demo purposes (would be Redis/Postgres in prod)
const db = {
    users: new Map<string, any>(), // wallet -> user data
    links: new Map<string, string>(), // linkCode -> wallet
};

function generateRandomAddress() {
    const chars = '0123456789abcdef';
    let addr = '0x';
    for (let i = 0; i < 40; i++) {
        addr += chars[Math.floor(Math.random() * chars.length)];
    }
    return addr;
}

function generateCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export async function POST(
    request: NextRequest,
    { params }: { params: { action: string } }
) {
    const action = params.action;
    const body = await request.json();

    if (action === 'generate-agent') {
        const { userWallet } = body;
        if (!userWallet) return NextResponse.json({ error: 'Missing wallet' }, { status: 400 });

        let userData = db.users.get(userWallet) || {};
        if (!userData.agentAddress) {
            userData.agentAddress = generateRandomAddress();
            userData.isNew = true;
        } else {
            userData.isNew = false;
        }
        db.users.set(userWallet, userData);

        return NextResponse.json({
            agentAddress: userData.agentAddress,
            isNew: userData.isNew,
        });
    }

    if (action === 'generate-telegram-link') {
        const { userWallet } = body;
        if (!userWallet) return NextResponse.json({ error: 'Missing wallet' }, { status: 400 });

        const existingUser = db.users.get(userWallet);
        if (existingUser?.telegramUser) {
            return NextResponse.json({
                alreadyLinked: true,
                telegramUser: existingUser.telegramUser
            });
        }

        const linkCode = generateCode();
        db.links.set(linkCode, userWallet);

        return NextResponse.json({
            linkCode,
            deepLink: `https://t.me/OstiumTradingBot?start=${linkCode}`,
            botUsername: 'OstiumTradingBot',
            alreadyLinked: false,
        });
    }

    if (action === 'create-agent') {
        const { userWallet, telegramAlphaUserId, tradingPreferences } = body;

        let userData = db.users.get(userWallet) || {};
        userData.telegramAlphaUserId = telegramAlphaUserId;
        userData.tradingPreferences = tradingPreferences;
        userData.isSetupComplete = true;

        // Simulate real agent creation details
        userData.agent = {
            id: 'agent-' + generateCode(),
            status: 'active'
        };
        userData.deployment = {
            address: userData.agentAddress,
            network: 'arbitrum-sepolia'
        };

        db.users.set(userWallet, userData);

        return NextResponse.json({
            success: true,
            agent: userData.agent,
            deployment: userData.deployment,
            ostiumAgentAddress: userData.agentAddress
        });
    }

    // Simulation endpoint to force-link telegram (for demo)
    if (action === 'simulate-telegram-link') {
        const { linkCode } = body;
        const wallet = db.links.get(linkCode);
        if (wallet) {
            let userData = db.users.get(wallet) || {};
            userData.telegramUser = {
                id: '12345678',
                username: 'demo_user',
                first_name: 'Demo',
                last_name: 'User'
            };
            db.users.set(wallet, userData);
            return NextResponse.json({ success: true, wallet });
        }
        return NextResponse.json({ error: 'Invalid code' }, { status: 404 });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 404 });
}

export async function GET(
    request: NextRequest,
    { params }: { params: { action: string } }
) {
    const action = params.action;
    const searchParams = request.nextUrl.searchParams;

    if (action === 'check-telegram-status') {
        const userWallet = searchParams.get('userWallet');
        const linkCode = searchParams.get('linkCode');

        if (!userWallet) return NextResponse.json({ error: 'Missing wallet' }, { status: 400 });

        const userData = db.users.get(userWallet);
        // In a real app, the telegram bot would have updated the DB via webhook
        // For this demo, we can assume if the user asks, we check the DB.
        // I added a simulate endpoint above to manually trigger this if needed, 
        // but to make it "easy" for the user, I'll auto-link after 5 seconds if code exists?
        // No, that's magic. I'll rely on the user status.
        // BUT! Since there is no actual telegram bot running, I should Auto-Link here if the code matches to give a smooth demo experience.

        if (linkCode && db.links.get(linkCode) === userWallet) {
            // Auto-simulate connection for demo purposes
            if (!userData?.telegramUser) {
                const newData = userData || {};
                newData.telegramUser = {
                    id: 'user-' + userWallet.substring(0, 6),
                    telegram_user_id: '12345678',
                    telegram_username: 'demo_user'
                };
                db.users.set(userWallet, newData);
                return NextResponse.json({
                    connected: true,
                    telegramUser: newData.telegramUser
                });
            }
        }

        if (userData?.telegramUser) {
            return NextResponse.json({
                connected: true,
                telegramUser: userData.telegramUser
            });
        }

        return NextResponse.json({ connected: false });
    }

    if (action === 'check-setup') {
        const userWallet = searchParams.get('userWallet');
        if (!userWallet) return NextResponse.json({ error: 'Missing wallet' }, { status: 400 });

        const userData = db.users.get(userWallet);
        if (userData?.isSetupComplete) {
            return NextResponse.json({
                isSetupComplete: true,
                agent: userData.agent,
                telegramUser: userData.telegramUser,
                ostiumAgentAddress: userData.agentAddress,
                tradingPreferences: userData.tradingPreferences
            });
        }

        return NextResponse.json({ isSetupComplete: false });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 404 });
}
