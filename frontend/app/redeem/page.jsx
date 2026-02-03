
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { redeemTicket, getAvailableTickets, getMyTickets } from "@/lib/api";
import { Gift, Loader2, PartyPopper, AlertCircle, Ticket, Clock } from "lucide-react";

export default function RedeemPage() {
    const [formData, setFormData] = useState({ name: "", code: "" });
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [availableTickets, setAvailableTickets] = useState([]);
    const [myTickets, setMyTickets] = useState([]);
    const [fetching, setFetching] = useState(true);

    const { user, loading: authLoading, logout, setUser } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!authLoading) {
            if (!user) {
                router.push('/login');
            } else {
                fetchData();
            }
        }
    }, [user, authLoading, router]);

    const fetchData = async () => {
        setFetching(true);
        try {
            const [available, mine] = await Promise.all([
                getAvailableTickets(),
                getMyTickets()
            ]);
            setAvailableTickets(available);
            setMyTickets(mine);
        } catch (error) {
            console.error("Failed to fetch tickets", error);
        } finally {
            setFetching(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResult(null);

        try {
            // Name is no longer needed as we use the logged-in user
            const response = await redeemTicket("", formData.code);

            // Update the user state with new points from the backend response
            if (user && response.data.userPoints !== undefined) {
                setUser({
                    ...user,
                    points: response.data.userPoints
                });
            }

            setResult({
                success: true,
                message: response.message,
                points: response.data.ticket.reward
            });
            fetchData(); // Refresh lists after successful redemption
        } catch (error) {
            setResult({
                success: false,
                message: error.response?.data?.message || "Something went wrong. Please try again."
            });
        } finally {
            setLoading(false);
        }
    };

    if (authLoading || !user) return null;

    return (
        <main className="min-h-screen bg-[#050505] text-white p-4 md:p-8 lg:p-12 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10 h-full flex flex-col">
                {/* Header Section */}
                <header className="flex items-center justify-between mb-12">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-4"
                    >
                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                            <Ticket className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Lucky Ticket</h1>
                            <p className="text-gray-400 text-sm">Dashboard / {user.name}</p>
                        </div>
                    </motion.div>

                    <div className="flex items-center gap-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white/5 border border-white/10 px-6 py-2.5 rounded-2xl flex items-center gap-3 backdrop-blur-md"
                        >
                            <PartyPopper className="w-5 h-5 text-primary" />
                            <div className="flex flex-col">
                                <span className="text-[10px] text-gray-400 uppercase font-bold leading-none mb-1">Balance</span>
                                <span className="text-xl font-bold leading-none">{user.points} <span className="text-xs text-primary font-medium">PTS</span></span>
                            </div>
                        </motion.div>
                        <Button
                            variant="ghost"
                            onClick={logout}
                            className="text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl px-4 py-6"
                        >
                            Logout
                        </Button>
                    </div>
                </header>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* LEFT COLUMN: Available Codes (Small Place) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="lg:col-span-3 space-y-6 lg:sticky lg:top-8"
                    >
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2">
                                    <Ticket className="w-4 h-4 text-primary" /> Available
                                </h3>
                                <span className="bg-primary/20 text-primary text-[10px] px-2 py-0.5 rounded-full font-bold">
                                    {availableTickets.length}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 gap-2 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                                {availableTickets.length > 0 ? (
                                    availableTickets.map((ticket, i) => (
                                        <motion.button
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            key={ticket._id}
                                            onClick={() => setFormData({ ...formData, code: ticket.code })}
                                            className="px-4 py-3 bg-white/[0.03] border border-white/5 rounded-xl text-left hover:bg-white/[0.08] hover:border-primary/50 transition-all group flex items-center justify-between"
                                        >
                                            <span className="font-mono text-sm group-hover:text-primary transition-colors">{ticket.code}</span>
                                            <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                                            </div>
                                        </motion.button>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-gray-600">
                                        <p className="text-xs">No codes available</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* CENTER COLUMN: Redeem Box (Seperate conceptually) */}
                    <div className="lg:col-span-6 flex flex-col items-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ type: "spring", damping: 20 }}
                            className="w-full max-w-md"
                        >
                            <Card className="bg-gradient-to-b from-white/[0.08] to-transparent border-white/10 rounded-[40px] shadow-2xl overflow-hidden backdrop-blur-2xl">
                                <CardHeader className="text-center pt-10 pb-6">
                                    <CardTitle className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500 mb-2">
                                        Claim Prize
                                    </CardTitle>
                                    <CardDescription className="text-gray-400 font-medium tracking-wide">
                                        Paste your secret code below
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="px-8 pb-10">
                                    <AnimatePresence mode="wait">
                                        {result?.success ? (
                                            <motion.div
                                                key="success"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="text-center py-4"
                                            >
                                                <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                                                    <PartyPopper className="w-12 h-12 text-primary" />
                                                    <motion.div
                                                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                                                        transition={{ repeat: Infinity, duration: 2 }}
                                                        className="absolute inset-0 bg-primary/20 rounded-full"
                                                    />
                                                </div>
                                                <h3 className="text-2xl font-bold mb-2">Success!</h3>
                                                <p className="text-gray-400 mb-8">{result.message}</p>
                                                <div className="text-5xl font-black text-primary mb-10">
                                                    +{result.points}
                                                    <span className="text-sm align-top ml-1 opacity-50 uppercase tracking-widest font-medium">pts</span>
                                                </div>
                                                <Button
                                                    className="w-full py-7 rounded-2xl text-lg font-bold"
                                                    onClick={() => {
                                                        setResult(null);
                                                        setFormData({ name: "", code: "" });
                                                    }}
                                                >
                                                    Redeem Another
                                                </Button>
                                            </motion.div>
                                        ) : (
                                            <form onSubmit={handleSubmit} className="space-y-6">
                                                <div className="relative group">
                                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-purple-600/50 rounded-2xl blur opacity-20 group-focus-within:opacity-100 transition duration-1000"></div>
                                                    <Input
                                                        placeholder="ENTER CODE"
                                                        value={formData.code}
                                                        onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                                        required
                                                        maxLength={8}
                                                        className="relative bg-black/40 border-white/10 text-white placeholder:text-white/10 font-mono tracking-[0.4em] h-24 text-4xl text-center rounded-2xl focus-visible:ring-primary/50 focus-visible:border-primary/50 uppercase transition-all"
                                                    />
                                                </div>

                                                {result?.success === false && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: "auto" }}
                                                        className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-300 text-sm font-medium"
                                                    >
                                                        <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
                                                        {result.message}
                                                    </motion.div>
                                                )}

                                                <Button
                                                    type="submit"
                                                    className="w-full h-18 text-xl font-black uppercase tracking-widest flex items-center justify-center gap-4 rounded-3xl shadow-[0_20px_40px_-15px_rgba(var(--primary),0.3)] hover:shadow-[0_25px_50px_-12px_rgba(var(--primary),0.5)] transition-all active:scale-[0.98]"
                                                    variant="premium"
                                                    disabled={loading}
                                                >
                                                    {loading ? (
                                                        <Loader2 className="w-6 h-6 animate-spin" />
                                                    ) : (
                                                        <>Verify Code <Gift className="w-6 h-6" /></>
                                                    )}
                                                </Button>
                                            </form>
                                        )}
                                    </AnimatePresence>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>

                    {/* RIGHT COLUMN: History (Different Place) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-3 lg:sticky lg:top-8"
                    >
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-6 flex items-center gap-2">
                                <Clock className="w-4 h-4 text-emerald-400" /> Redeemed
                            </h3>

                            <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                                {myTickets.length > 0 ? (
                                    myTickets.map((ticket, i) => (
                                        <motion.div
                                            initial={{ opacity: 0, x: 10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            key={ticket._id}
                                            className="bg-emerald-500/5 border border-emerald-500/10 p-4 rounded-2xl flex flex-col gap-2 relative group overflow-hidden"
                                        >
                                            <div className="flex items-center justify-between relative z-10">
                                                <span className="font-mono text-sm text-emerald-400/80">{ticket.code}</span>
                                                <div className="bg-emerald-500 text-[10px] text-black px-2 py-0.5 rounded-full font-black uppercase tracking-tighter">
                                                    Redeemed
                                                </div>
                                            </div>
                                            <div className="text-[10px] text-gray-500 flex items-center gap-1.5 uppercase tracking-wider font-bold">
                                                <Clock className="w-2.5 h-2.5" />
                                                {new Date(ticket.usedAt).toLocaleDateString()}
                                            </div>
                                            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl -mr-12 -mt-12 transition-all group-hover:scale-150" />
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-gray-600">
                                        <p className="text-xs">History is empty</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>

                </div>

                {/* Footer Info
                <footer className="mt-auto pt-12 text-center text-gray-600 text-[10px] uppercase tracking-[0.3em] font-bold">
                    &copy; {new Date().getFullYear()} Lucky Ticket System &bull; Secure Redemption Portal
                </footer> */}
            </div>
        </main>
    );
}
