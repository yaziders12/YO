
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2, Play, Pause, Edit } from 'lucide-react';
import { toast, Toaster } from 'sonner';

// Custom hook for managing alerts with localStorage
const useAlerts = () => {
    const [alerts, setAlerts] = useState([]);
    
    useEffect(() => {
        try {
            const storedAlerts = localStorage.getItem('pulsekai-alerts');
            if (storedAlerts) {
                setAlerts(JSON.parse(storedAlerts));
            }
        } catch (error) {
            console.error("Failed to load alerts from localStorage", error);
        }
    }, []);

    const saveAlerts = (newAlerts) => {
        try {
            setAlerts(newAlerts);
            localStorage.setItem('pulsekai-alerts', JSON.stringify(newAlerts));
        } catch (error) {
            console.error("Failed to save alerts to localStorage", error);
        }
    };
    
    return [alerts, saveAlerts];
};

const AlertForm = ({ isOpen, onOpenChange, onSave, existingAlert }) => {
    const [type, setType] = useState('');
    const [triggerValue, setTriggerValue] = useState('');
    const [channels, setChannels] = useState([]);

    useEffect(() => {
        if (existingAlert) {
            setType(existingAlert.type);
            setTriggerValue(existingAlert.trigger.value);
            setChannels(existingAlert.delivery);
        } else {
            setType('');
            setTriggerValue('');
            setChannels([]);
        }
    }, [existingAlert]);

    const handleSave = () => {
        if (!type || !triggerValue || channels.length === 0) {
            toast.error("Please fill all fields to create an alert.");
            return;
        }
        
        const newAlert = {
            id: existingAlert ? existingAlert.id : Date.now(),
            name: `${type}: ${triggerValue}`,
            type: type,
            trigger: { type: 'threshold', value: triggerValue },
            delivery: channels,
            status: existingAlert ? existingAlert.status : 'ACTIVE',
        };
        onSave(newAlert);
    };
    
    const handleChannelChange = (channel, checked) => {
        setChannels(prev => checked ? [...prev, channel] : prev.filter(c => c !== channel));
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="glassy-card">
                <DialogHeader>
                    <DialogTitle>{existingAlert ? 'Edit Alert' : 'Create New Alert'}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div>
                        <label className="text-sm font-medium">Alert Type</label>
                        <Select value={type} onValueChange={setType}>
                            <SelectTrigger><SelectValue placeholder="Select alert type..." /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Price">Price Target</SelectItem>
                                <SelectItem value="EventProb">Event Probability</SelectItem>
                                <SelectItem value="VaR">Portfolio VaR</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <label className="text-sm font-medium">Trigger</label>
                        <Input 
                          placeholder={
                            type === 'Price' ? "e.g., AAPL < 170" :
                            type === 'EventProb' ? "e.g., FedCutSept > 70%" :
                            type === 'VaR' ? "e.g., > 5%" : "Set trigger value..."
                          }
                          value={triggerValue} 
                          onChange={(e) => setTriggerValue(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Delivery Channels</label>
                        <div className="flex items-center space-x-4 pt-2">
                           {['Push', 'Email', 'SMS'].map(channel => (
                                <div key={channel} className="flex items-center space-x-2">
                                    <Checkbox 
                                        id={channel} 
                                        checked={channels.includes(channel)} 
                                        onCheckedChange={(checked) => handleChannelChange(channel, checked)}
                                    />
                                    <label htmlFor={channel}>{channel}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-500">Save Alert</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default function AlertsPage() {
    const [alerts, setAlerts] = useAlerts();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingAlert, setEditingAlert] = useState(null);

    const handleSaveAlert = (alert) => {
        const newAlerts = editingAlert 
            ? alerts.map(a => a.id === alert.id ? alert : a)
            : [...alerts, alert];
        setAlerts(newAlerts);
        setIsFormOpen(false);
        setEditingAlert(null);
        toast.success(`Alert ${editingAlert ? 'updated' : 'created'} successfully!`);
    };

    const handleEdit = (alert) => {
        setEditingAlert(alert);
        setIsFormOpen(true);
    };
    
    const handleDelete = (alertId) => {
        setAlerts(alerts.filter(a => a.id !== alertId));
        toast.info("Alert deleted.");
    };
    
    const handleToggleStatus = (alertId) => {
        setAlerts(alerts.map(a => a.id === alertId ? {...a, status: a.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE'} : a));
    };

    return (
        <div className="space-y-6">
            <Toaster richColors position="bottom-right" theme="dark"/>
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-white">Alerts Manager</h1>
                <Button onClick={() => { setEditingAlert(null); setIsFormOpen(true); }}>
                    <Plus className="mr-2 h-4 w-4" /> New Alert
                </Button>
            </div>
            
            <div className="glassy-card rounded-xl">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Alert</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Trigger</TableHead>
                            <TableHead>Delivery</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {alerts.map(alert => (
                            <TableRow key={alert.id}>
                                <TableCell className="font-medium">{alert.name}</TableCell>
                                <TableCell>{alert.type}</TableCell>
                                <TableCell>{alert.trigger.value}</TableCell>
                                <TableCell>{alert.delivery.join(', ')}</TableCell>
                                <TableCell>
                                    <span className={`px-2 py-1 text-xs rounded-full ${alert.status === 'ACTIVE' ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}`}>
                                        {alert.status}
                                    </span>
                                </TableCell>
                                <TableCell className="flex gap-2">
                                    <Button variant="ghost" size="icon" onClick={() => handleToggleStatus(alert.id)}>
                                        {alert.status === 'ACTIVE' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => handleEdit(alert)}>
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => handleDelete(alert.id)} className="text-red-500 hover:text-red-400">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                         {alerts.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center h-24 text-slate-400">
                                    You have no active alerts. Create one to get started.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            
            <AlertForm 
                isOpen={isFormOpen}
                onOpenChange={setIsFormOpen}
                onSave={handleSaveAlert}
                existingAlert={editingAlert}
            />
        </div>
    );
}
