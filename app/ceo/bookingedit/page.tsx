"use client"

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Edit, PlusCircle, Star } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const initialLocations = [
    { id: 'downtown-studio', name: 'Downtown Studio (Los Angeles)' },
    { id: 'santa-monica', name: 'Beachside Photoshoot (Santa Monica)' },
    { id: 'arts-district', name: 'Urban Exploration (Arts District)' },
    { id: 'custom', name: 'Your Custom Location (Requires Approval)' },
];

const initialTimeSlots = [
    { id: 'morning', name: '9:00 AM - 11:00 AM' },
    { id: 'afternoon', name: '1:00 PM - 3:00 PM' },
    { id: 'evening', name: '4:00 PM - 6:00 PM' },
    { id: 'sunset', name: 'Sunset Session (Varies)' },
];

const initialPackages = [
  {
    id: "starter-pack",
    name: "Starter Media Pack",
    price: 250,
    features: ["30-min photo session", "5 retouched photos", "1 short-form video (30s)"],
    description: "Perfect for social media profiles and quick content.",
    popular: false,
  },
  {
    id: "pro-pack",
    name: "Pro Content Package",
    price: 550,
    features: ["90-min photo & video session", "15 retouched photos", "3 short-form videos (up to 60s)"],
    description: "Ideal for creators building a comprehensive portfolio.",
    popular: true,
  },
  {
    id: "brand-builder",
    name: "Brand Builder Session",
    price: 950,
    features: ["3-hour full session", "30+ retouched photos", "1 long-form video (2-3 min)", "5 short-form videos"],
    description: "A complete media solution to define your brand.",
    popular: false,
  },
];

export default function BookingEditPage() {
    const [locations, setLocations] = useState(initialLocations);
    const [timeSlots, setTimeSlots] = useState(initialTimeSlots);
    const [packages, setPackages] = useState(initialPackages);
    const [newLocation, setNewLocation] = useState('');
    const [newTimeSlot, setNewTimeSlot] = useState('');

    const handleAddLocation = () => {
        if (newLocation.trim() !== '') {
            setLocations([...locations, { id: newLocation.toLowerCase().replace(/\s+/g, '-'), name: newLocation }]);
            setNewLocation('');
        }
    };

    const handleAddTimeSlot = () => {
        if (newTimeSlot.trim() !== '') {
            setTimeSlots([...timeSlots, { id: newTimeSlot.toLowerCase().replace(/\s+/g, '-'), name: newTimeSlot }]);
            setNewTimeSlot('');
        }
    };

    const handleDeleteLocation = (id: string) => {
        setLocations(locations.filter(loc => loc.id !== id));
    };

    const handleDeleteTimeSlot = (id: string) => {
        setTimeSlots(timeSlots.filter(ts => ts.id !== id));
    };

    return (
        <div className="container mx-auto px-4 py-12 md:px-6 md:py-16">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Manage Booking Options</h1>
                <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                    Add, edit, or remove packages, locations, and time slots for photo sessions.
                </p>
            </div>

            <div className="space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Manage Packages</CardTitle>
                        <CardDescription>Control available media packages, pricing, and features.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Accordion type="single" collapsible className="w-full">
                            {packages.map((pkg, index) => (
                                <AccordionItem value={pkg.id} key={pkg.id}>
                                    <AccordionTrigger className="flex justify-between items-center">
                                        <div className="flex items-center gap-4">
                                            <span className="font-medium">{pkg.name}</span>
                                            {pkg.popular && <Star className="h-5 w-5 text-yellow-500 fill-yellow-400" />}
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <div className="space-y-4 pt-2">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor={`pkg-name-${index}`}>Package Name</Label>
                                                    <Input id={`pkg-name-${index}`} value={pkg.name} disabled />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor={`pkg-price-${index}`}>Price ($)</Label>
                                                    <Input id={`pkg-price-${index}`} type="number" value={pkg.price} disabled />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor={`pkg-desc-${index}`}>Description</Label>
                                                <Textarea id={`pkg-desc-${index}`} value={pkg.description} disabled />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Features</Label>
                                                {pkg.features.map((feature, fIndex) => (
                                                    <div key={fIndex} className="flex items-center gap-2">
                                                        <Input value={feature} disabled />
                                                        <Button variant="ghost" size="icon" disabled><Trash2 className="h-4 w-4" /></Button>
                                                    </div>
                                                ))}
                                                <Button variant="outline" size="sm" disabled><PlusCircle className="h-4 w-4 mr-2" /> Add Feature</Button>
                                            </div>
                                            <div className="flex items-center justify-between pt-4">
                                                <div className="flex items-center space-x-2">
                                                    <Switch id={`popular-switch-${index}`} checked={pkg.popular} disabled />
                                                    <Label htmlFor={`popular-switch-${index}`}>Mark as Popular</Label>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button variant="outline" disabled>Save Changes</Button>
                                                    <Button variant="destructive" disabled><Trash2 className="h-4 w-4 mr-2" />Delete Package</Button>
                                                </div>
                                            </div>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                        <div className="mt-6">
                            <Button disabled><PlusCircle className="h-4 w-4 mr-2" /> Add New Package</Button>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Manage Locations</CardTitle>
                            <CardDescription>Control available photoshoot locations.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {locations.map(location => (
                                    <div key={location.id} className="flex items-center justify-between p-2 rounded-md bg-gray-50">
                                        <span>{location.name}</span>
                                        <div className="flex items-center gap-2">
                                            <Button variant="ghost" size="icon" disabled><Edit className="h-4 w-4" /></Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDeleteLocation(location.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 flex gap-2">
                                <Input
                                    value={newLocation}
                                    onChange={(e) => setNewLocation(e.target.value)}
                                    placeholder="Add new location"
                                />
                                <Button onClick={handleAddLocation}><PlusCircle className="h-4 w-4 mr-2" /> Add</Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Manage Time Slots</CardTitle>
                            <CardDescription>Control available booking times.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {timeSlots.map(ts => (
                                    <div key={ts.id} className="flex items-center justify-between p-2 rounded-md bg-gray-50">
                                        <span>{ts.name}</span>
                                        <div className="flex items-center gap-2">
                                            <Button variant="ghost" size="icon" disabled><Edit className="h-4 w-4" /></Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDeleteTimeSlot(ts.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                             <div className="mt-6 flex gap-2">
                                <Input
                                    value={newTimeSlot}
                                    onChange={(e) => setNewTimeSlot(e.target.value)}
                                    placeholder="Add new time slot"
                                />
                                <Button onClick={handleAddTimeSlot}><PlusCircle className="h-4 w-4 mr-2" /> Add</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
} 