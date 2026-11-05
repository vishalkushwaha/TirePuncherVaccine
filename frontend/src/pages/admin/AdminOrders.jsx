import React, { useState, useEffect } from 'react';
import {
  Package,
  Search,
  Phone,
  Printer,
  Truck,
  CheckCircle2,
  Calendar,
  MapPin,
  ExternalLink,
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import { api } from '../../services/api';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Edit State
  const [editStatus, setEditStatus] = useState('');
  const [editPaymentStatus, setEditPaymentStatus] = useState('');
  const [editTrackingNumber, setEditTrackingNumber] = useState('');
  const [editShippingPartner, setEditShippingPartner] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  const loadOrders = () => {
    setLoading(true);
    api.admin.getOrders(statusFilter, searchTerm)
      .then(data => {
        setOrders(data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadOrders();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadOrders();
  };

  const handleUpdateOrder = async () => {
    if (!selectedOrder) return;
    setUpdating(true);
    try {
      await api.admin.updateOrder(selectedOrder.id, {
        order_status: editStatus,
        payment_status: editPaymentStatus,
        tracking_number: editTrackingNumber,
        shipping_partner: editShippingPartner,
        notes: editNotes
      });
      setSelectedOrder(null);
      loadOrders();
    } catch (err) {
      alert('Failed to update order: ' + err.message);
    } finally {
      setUpdating(false);
    }
  };

  const totalRevenue = orders.reduce((acc, o) => acc + (o.total_amount || 0), 0);
  const newOrdersCount = orders.filter(o => o.order_status === 'New').length;
  const dispatchedCount = orders.filter(o => o.order_status === 'Dispatched').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Package size={22} className="text-cyan-700" />
            <h1 className="text-2xl font-extrabold text-navy">Customer Orders & Invoicing</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage customer orders, track courier shipments from Bikaner, and print GST tax invoices
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {['', 'New', 'Processing', 'Dispatched', 'Delivered', 'Cancelled'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === st
                  ? 'bg-navy text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {st || 'All Orders'}
              {st === 'New' && newOrdersCount > 0 && (
                <span className="ml-1.5 px-1.5 py-0.2 bg-emerald-500 text-white text-[10px] rounded-full">
                  {newOrdersCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase text-slate-400 block">Total Orders</span>
          <span className="text-xl font-extrabold text-navy">{orders.length}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase text-slate-400 block">Total Order Revenue</span>
          <span className="text-xl font-extrabold text-emerald-700">₹{Math.round(totalRevenue).toLocaleString('en-IN')}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase text-slate-400 block">Awaiting Dispatch</span>
          <span className="text-xl font-extrabold text-amber-600">{newOrdersCount} New</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase text-slate-400 block">In Transit</span>
          <span className="text-xl font-extrabold text-cyan-800">{dispatchedCount} Dispatched</span>
        </div>
      </div>

      {/* Search Input */}
      <div className="max-w-md">
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by order #, customer, phone, city..."
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-600 bg-white"
          />
        </form>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase text-[11px] tracking-wider">
                <th className="p-4">Order #</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Phone / City</th>
                <th className="p-4">Products / Qty</th>
                <th className="p-4">Total Amount</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-slate-400 text-xs">
                    {loading ? 'Loading orders...' : 'No customer orders found.'}
                  </td>
                </tr>
              ) : (
                orders.map(order => (
                  <tr key={order.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4 font-mono font-bold text-cyan-800">
                      {order.order_number}
                      <span className="block text-[10px] text-slate-400 font-normal">
                        {order.created_at ? new Date(order.created_at).toLocaleDateString() : ''}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-navy">
                      {order.customer_name}
                    </td>
                    <td className="p-4">
                      <a href={`tel:${order.customer_phone}`} className="font-semibold text-slate-800 hover:text-cyan-700 block">
                        {order.customer_phone}
                      </a>
                      <span className="text-[11px] text-slate-500 block">{order.city}, {order.state}</span>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-navy block">
                        {order.items?.reduce((a, b) => a + b.quantity, 0) || 1} Bottles
                      </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {order.items?.map(it => (
                          <span key={it.id} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold uppercase">
                            {it.product_code}: {it.quantity}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 font-black text-navy text-cyan-800">
                      ₹{Math.round(order.total_amount).toLocaleString('en-IN')}
                    </td>
                    <td className="p-4">
                      <span className="font-bold block text-slate-800">{order.payment_method}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        order.payment_status === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {order.payment_status}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        order.order_status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                        order.order_status === 'Dispatched' ? 'bg-cyan-100 text-cyan-800' :
                        order.order_status === 'Processing' ? 'bg-indigo-100 text-indigo-800' :
                        order.order_status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {order.order_status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setEditStatus(order.order_status);
                          setEditPaymentStatus(order.payment_status);
                          setEditTrackingNumber(order.tracking_number || '');
                          setEditShippingPartner(order.shipping_partner || '');
                          setEditNotes(order.notes || '');
                        }}
                        className="px-3 py-1.5 bg-navy hover:bg-cyan-700 text-white rounded-md text-xs font-bold transition-colors"
                      >
                        Manage & Invoice
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manage Order Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase font-extrabold tracking-wider bg-cyan-100 text-cyan-800 px-2.5 py-0.5 rounded-full">
                    Customer Order
                  </span>
                  <span className="text-xs text-slate-400 font-mono">{selectedOrder.order_number}</span>
                </div>
                <h3 className="text-xl font-extrabold text-navy mt-1">
                  {selectedOrder.customer_name}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 border rounded-lg text-xs font-semibold flex items-center gap-1.5 hover:bg-slate-50"
                  title="Print Invoice"
                >
                  <Printer size={14} />
                  <span>Print Invoice</span>
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 font-bold"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Customer Details */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-400 uppercase tracking-wider block text-[10px] font-bold">Contact</span>
                <span className="font-bold text-navy">{selectedOrder.customer_phone}</span>
                <span className="text-slate-500 block">{selectedOrder.customer_email || 'No email provided'}</span>
              </div>
              <div>
                <span className="text-slate-400 uppercase tracking-wider block text-[10px] font-bold">Shipping Destination</span>
                <span className="font-semibold text-slate-800">{selectedOrder.shipping_address}</span>
                <span className="text-slate-500 block">{selectedOrder.city}, {selectedOrder.state} - {selectedOrder.pin_code}</span>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                    <th className="p-2.5">Product</th>
                    <th className="p-2.5 text-center">Qty</th>
                    <th className="p-2.5 text-right">Unit Price</th>
                    <th className="p-2.5 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedOrder.items?.map(it => (
                    <tr key={it.id}>
                      <td className="p-2.5 font-bold text-navy">
                        {it.product_name}
                        <span className="text-[10px] font-mono text-slate-400 block uppercase">Code: {it.product_code}</span>
                      </td>
                      <td className="p-2.5 text-center font-bold">{it.quantity}</td>
                      <td className="p-2.5 text-right text-slate-600">₹{it.unit_price}</td>
                      <td className="p-2.5 text-right font-extrabold text-navy">₹{it.total_price?.toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-col gap-1 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span>₹{selectedOrder.subtotal?.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Shipping Fee:</span>
                  <span>{selectedOrder.shipping_fee === 0 ? 'FREE' : `₹${selectedOrder.shipping_fee}`}</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-navy border-t pt-1">
                  <span>Total Amount:</span>
                  <span className="text-cyan-800 font-black">₹{Math.round(selectedOrder.total_amount).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Status & Courier Updates */}
            <div className="space-y-4 pt-2 border-t">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Order Status
                  </label>
                  <select
                    value={editStatus}
                    onChange={e => setEditStatus(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-cyan-600"
                  >
                    <option value="New">New (Received)</option>
                    <option value="Processing">Processing / Packed at Bikaner</option>
                    <option value="Dispatched">Dispatched / In Transit</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled (Auto-Restock)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Payment Status
                  </label>
                  <select
                    value={editPaymentStatus}
                    onChange={e => setEditPaymentStatus(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-cyan-600"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="Failed">Failed</option>
                    <option value="Refunded">Refunded</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Courier / Shipping Partner
                  </label>
                  <input
                    type="text"
                    value={editShippingPartner}
                    onChange={e => setEditShippingPartner(e.target.value)}
                    placeholder="e.g. DTDC, Delhivery, Marwar Roadways"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Tracking / AWB Number
                  </label>
                  <input
                    type="text"
                    value={editTrackingNumber}
                    onChange={e => setEditTrackingNumber(e.target.value)}
                    placeholder="e.g. D123456789IN"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Internal Notes
                </label>
                <textarea
                  rows={2}
                  value={editNotes}
                  onChange={e => setEditNotes(e.target.value)}
                  placeholder="e.g. Dispatched via evening parcel bus..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 border border-slate-300 hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={updating}
                onClick={handleUpdateOrder}
                className="px-5 py-2 bg-navy hover:bg-cyan-700 text-white rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
              >
                {updating ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

