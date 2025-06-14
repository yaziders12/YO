
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { toast, Toaster } from 'sonner';

const LEADERS_DATA = [
    { rank: 1, handle: '@MacroMaven', hitRate: 78, sharpe: 1.40, following: false },
    { rank: 2, handle: '@GammaGuru', hitRate: 74, sharpe: 1.25, following: true },
    { rank: 3, handle: '@CreditSpreadKing', hitRate: 71, sharpe: 1.18, following: false },
];

const PACKS_DATA = [
    { title: 'Election Gridlock Pack', hitRate: 64, price: 'FREE', imported: false },
    { title: 'AI Mania Pack', hitRate: 70, price: '$9', imported: false },
    { title: 'Recession Playbook', hitRate: 68, price: '$9', imported: false },
];

export default function LeadersPage() {
    const handleFollow = (handle) => toast.success(`You are now following ${handle}`);
    const handleImport = (title) => toast.success(`${title} has been imported to your scenario grid.`);

    return (
        <div className="space-y-6">
            <Toaster richColors position="bottom-right" theme="dark"/>
            <h1 className="text-2xl font-bold text-white">Leaders & Marketplace</h1>
            <Tabs defaultValue="leaderboard">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="leaderboard">★ Leaderboard</TabsTrigger>
                    <TabsTrigger value="packs">Scenario Packs</TabsTrigger>
                </TabsList>
                <TabsContent value="leaderboard" className="mt-6">
                    <div className="glassy-card rounded-xl">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Rank</TableHead>
                                    <TableHead>Handle</TableHead>
                                    <TableHead>Hit Rate</TableHead>
                                    <TableHead>Sharpe</TableHead>
                                    <TableHead>Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {LEADERS_DATA.map(leader => (
                                    <TableRow key={leader.handle}>
                                        <TableCell className="font-bold text-lg">{leader.rank}</TableCell>
                                        <TableCell className="font-medium text-blue-400">{leader.handle}</TableCell>
                                        <TableCell>{leader.hitRate}%</TableCell>
                                        <TableCell>{leader.sharpe.toFixed(2)}</TableCell>
                                        <TableCell>
                                            <Button variant={leader.following ? "secondary" : "outline"} onClick={() => handleFollow(leader.handle)}>
                                                {leader.following ? 'Following' : 'Follow'}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>
                <TabsContent value="packs" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {PACKS_DATA.map(pack => (
                            <Card key={pack.title} className="glassy-card">
                                <CardHeader>
                                    <CardTitle>{pack.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p>Hit Rate: <span className="font-bold text-green-400">{pack.hitRate}%</span></p>
                                    <p>Price: <span className="font-bold text-amber-400">{pack.price}</span></p>
                                </CardContent>
                                <CardFooter>
                                    <Button className="w-full" onClick={() => handleImport(pack.title)}>
                                        {pack.price === 'FREE' ? 'Import' : 'Buy & Import'}
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
