"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { formatPrice, type PublicMenuItem } from "@/lib/menu-types";
import { todayLocal } from "@/lib/order-types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function OrderForm({ item }: { item: PublicMenuItem }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!deliveryDate) return toast.error("Please choose a delivery date");
    if (deliveryDate < todayLocal()) return toast.error("Delivery date cannot be in the past");
    if (deliveryAddress.trim().length < 5) return toast.error("Please enter your delivery address");

    setLoading(true);
    try {
      await apiFetch("/api/orders", {
        method: "POST",
        body: JSON.stringify({
          itemId: item._id,
          deliveryDate,
          deliveryAddress,
          message,
        }),
      });
      toast.success("Order placed. The restaurant will review it soon.");
      setOpen(false);
      router.push("/dashboard/customer/orders");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not place the order");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Button size="lg" className="h-12 w-full rounded-xl text-base" onClick={() => setOpen(true)}>
        <ShoppingBag className="size-5" /> Order Now
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-heading text-2xl">Place your order</DialogTitle>
            <DialogDescription>
              {item.itemName} · {formatPrice(item.price)}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="deliveryDate">Delivery date</Label>
              <Input
                id="deliveryDate"
                type="date"
                min={todayLocal()}
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                className="h-11 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deliveryAddress">Delivery address</Label>
              <Textarea
                id="deliveryAddress"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="House, road, area, city"
                rows={3}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="orderMessage">Special instructions (optional)</Label>
              <Textarea
                id="orderMessage"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="e.g. Extra cheese, ring the bell twice"
                rows={2}
                maxLength={300}
                className="rounded-xl"
              />
            </div>
            <Button type="submit" disabled={loading} className="h-11 w-full rounded-xl text-base">
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Placing order...
                </>
              ) : (
                "Place Order"
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}