
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle as UiCardTitle } from "@/components/ui/card";
import { generateTicket, getTickets, getAllUsers } from "@/lib/api";
import { Copy, RefreshCw, CheckCircle2, Ticket } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";

export default function AdminPage() {
    const { user, loading, logout } = useAuth();
    const router = useRouter();

    const [reward, setReward] = useState("");
    const [tickets, setTickets] = useState([]);
    const [usersList, setUsersList] = useState([]);
    const [ticketLoading, setTicketLoading] = useState(false);
    const [generatedTicket, setGeneratedTicket] = useState(null);
    const [copied, setCopied] = useState(false);
    const [view, setView] = useState('tickets');

    useEffect(() => {
        if (!loading && (!user || user.role !== 'admin')) {
            router.push('/login');
        }
    }, [user, loading, router]);

    const fetchTickets = async () => {
        try {
            const data = await getTickets();
            setTickets(data);
        } catch (error) {
            console.error("Failed to fetch tickets", error);
        }
    };

    const fetchUsers = async () => {
        try {
            const data = await getAllUsers();
            setUsersList(data);
        } catch (error) {
            console.error("Failed to fetch users", error);
        }
    };

    useEffect(() => {
        if (user?.role === 'admin') {
            fetchTickets();
            fetchUsers();
        }
    }, [user]);

    if (loading || !user || user.role !== 'admin') { // Prevent flash of content
        return null;
    }

    const handleGenerate = async (e) => {
        e.preventDefault();
        if (!reward) return;
        setTicketLoading(true);
        try {
            const res = await generateTicket(Number(reward));
            setGeneratedTicket(res.data);
            fetchTickets(); // Refresh list
            setReward("");
        } catch (error) {
            console.error("Failed to generate ticket", error);
        } finally {
            setTicketLoading(false);
        }
    };

    const handleCopy = () => {
        if (!generatedTicket?.code) return;

        if (navigator?.clipboard) {
            navigator.clipboard.writeText(generatedTicket.code).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            }).catch(() => {
                // Fallback or silence
            });
        } else {
            // Fallback for non-secure contexts or unsupported browsers
            const textArea = document.createElement("textarea");
            textArea.value = generatedTicket.code;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (err) {
                console.error('Fallback copy failed', err);
            }
            document.body.removeChild(textArea);
        }
    };

    return (
        <div className="h-screen p-8 flex flex-col space-y-8 overflow-hidden">
            <header className="flex-none flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
                        Admin Dashboard
                    </h1>
                    <p className="text-gray-400">Manage Lucky Tickets & Users</p>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500 hidden md:inline">Authenticated as {user.name}</span>
                    <Button
                        variant="outline"
                        onClick={logout}
                        className="bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20"
                    >
                        Logout
                    </Button>
                </div>
            </header>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-8 min-h-0 pb-4">
                {/* Generator Section */}
                <section className="md:col-span-1 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
                    <Card className="glass border-white/5">
                        <CardHeader>
                            <UiCardTitle className="flex items-center gap-2">
                                <Ticket className="w-5 h-5 text-primary" />
                                Generate Ticket
                            </UiCardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleGenerate} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Reward Points</label>
                                    <Input
                                        type="number"
                                        placeholder="e.g. 100"
                                        value={reward}
                                        onChange={(e) => setReward(e.target.value)}
                                        className="bg-white/5 border-white/10"
                                        min="1"
                                        required
                                    />
                                </div>
                                <Button type="submit" className="w-full" disabled={ticketLoading}>
                                    {ticketLoading ? <RefreshCw className="animate-spin w-4 h-4" /> : "Generate Code"}
                                </Button>
                            </form>

                            {generatedTicket && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20 text-center"
                                >
                                    <p className="text-sm text-gray-400 mb-1">New Ticket Generated:</p>
                                    <div className="text-2xl font-mono font-bold text-primary tracking-wider mb-2">
                                        {generatedTicket.code}
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-xs"
                                        onClick={handleCopy}
                                    >
                                        {copied ? <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-400" /> : <Copy className="w-3 h-3 mr-1" />}
                                        {copied ? "Copied" : "Copy Code"}
                                    </Button>
                                </motion.div>
                            )}
                        </CardContent>
                    </Card>

                    <div className="flex flex-col gap-2 mt-4">
                        <Button
                            variant={view === 'tickets' ? 'default' : 'secondary'}
                            onClick={() => setView('tickets')}
                            className="w-full justify-start"
                        >
                            <Ticket className="w-4 h-4 mr-2" /> Tickets History
                        </Button>
                        <Button
                            variant={view === 'users' ? 'default' : 'secondary'}
                            onClick={() => setView('users')}
                            className="w-full justify-start"
                        >
                            <CheckCircle2 className="w-4 h-4 mr-2" /> User Points
                        </Button>
                    </div>
                </section>

                {/* List Section */}
                <section className="md:col-span-3 h-full min-h-0">
                    <Card className="glass border-white/5 h-full flex flex-col">
                        <CardHeader className="flex-none flex flex-row items-center justify-between">
                            <UiCardTitle>{view === 'tickets' ? 'Ticket History' : 'User Points Collection'}</UiCardTitle>
                            <Button variant="ghost" size="icon" onClick={view === 'tickets' ? fetchTickets : fetchUsers}>
                                <RefreshCw className="w-4 h-4" />
                            </Button>
                        </CardHeader>
                        <CardContent className="flex-1 p-0 relative min-h-0">
                            <div className="absolute inset-0 overflow-y-auto custom-scrollbar p-6 pt-0">
                                {view === 'tickets' ? (
                                    <table className="w-full text-sm">
                                        <thead className="sticky top-0 bg-[#0f172a]/95 backdrop-blur-sm z-10">
                                            <tr className="border-b border-white/10 text-left">
                                                <th className="py-3 px-4 text-gray-400 font-medium">Code</th>
                                                <th className="py-3 px-4 text-gray-400 font-medium">Reward</th>
                                                <th className="py-3 px-4 text-gray-400 font-medium">Status</th>
                                                <th className="py-3 px-4 text-gray-400 font-medium">Used By</th>
                                                <th className="py-3 px-4 text-gray-400 font-medium">Created</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-gray-300">
                                            {tickets.map((ticket) => (
                                                <tr key={ticket._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                    <td className="py-3 px-4 font-mono">{ticket.code}</td>
                                                    <td className="py-3 px-4 font-bold text-emerald-400">{ticket.reward}</td>
                                                    <td className="py-3 px-4">
                                                        <span className={cn(
                                                            "px-2 py-1 rounded-full text-xs font-medium",
                                                            ticket.isUsed ? "bg-red-500/20 text-red-300" : "bg-green-500/20 text-green-300"
                                                        )}>
                                                            {ticket.isUsed ? "Redeemed" : "Available"}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4">{ticket.usedBy || "-"}</td>
                                                    <td className="py-3 px-4 text-gray-500 text-xs">
                                                        {new Date(ticket.createdAt).toLocaleDateString()}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <table className="w-full text-sm">
                                        <thead className="sticky top-0 bg-[#0f172a]/95 backdrop-blur-sm z-10">
                                            <tr className="border-b border-white/10 text-left">
                                                <th className="py-3 px-4 text-gray-400 font-medium">User Name</th>
                                                <th className="py-3 px-4 text-gray-400 font-medium">Email</th>
                                                <th className="py-3 px-4 text-gray-400 font-medium">Total Points</th>
                                                <th className="py-3 px-4 text-gray-400 font-medium">Member Since</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-gray-300">
                                            {usersList.map((usr) => (
                                                <tr key={usr._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                    <td className="py-3 px-4 font-bold text-white">{usr.name}</td>
                                                    <td className="py-3 px-4 text-gray-400">{usr.email}</td>
                                                    <td className="py-3 px-4">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                                                                P
                                                            </div>
                                                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">
                                                                {usr.points || 0}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4 text-gray-500 text-xs">
                                                        {new Date(usr.createdAt).toLocaleDateString()}
                                                    </td>
                                                </tr>
                                            ))}
                                            {usersList.length === 0 && (
                                                <tr>
                                                    <td colSpan={4} className="py-8 text-center text-gray-500">
                                                        No users found.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </section>
            </div>
        </div>
    );
}
