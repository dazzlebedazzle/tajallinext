import React, { useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Loader from '../components/Loader';
import { AuthContext } from '../components/auth';
import logo from '../assets/logotazalli.png';
import './Billing.css';

const API = `${process.env.REACT_APP_API_URL}/api/order`;
const STATUSES = ['Pending', 'Shipped', 'Delivered', 'Canceled'];
const PAGE_SIZE = 20;

// Seller details printed on every bill
const SELLER = {
  name: 'TAJALLI',
  tagline: 'An Afghan Product',
  website: 'www.tajalli.co.in',
  phone: '+91 8826069897',
};

const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` });

const rupees = (n) =>
  `₹${(Number(n) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const formatDate = (value, withTime = false) =>
  value
    ? new Date(value).toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        ...(withTime ? { hour: '2-digit', minute: '2-digit' } : {}),
      })
    : '—';

const formatWeight = (grams) => {
  const g = Number(grams);
  if (!Number.isFinite(g) || g <= 0) return '';
  return g >= 1000 ? `${parseFloat((g / 1000).toFixed(3))} kg` : `${g} g`;
};

const customerName = (bill) =>
  bill.shippingAddress?.name?.trim() ||
  [bill.user?.firstname, bill.user?.lastname].filter(Boolean).join(' ') ||
  'Customer';

const errorMessage = (error) => error?.response?.data?.message || error?.message || 'Something went wrong';

const toCsvCell = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`;

const Billing = () => {
  const { authState } = useContext(AuthContext);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState('');

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [page, setPage] = useState(1);

  const [openBill, setOpenBill] = useState(null);
  const [savingId, setSavingId] = useState(null);

  const fetchBills = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API}/orders`, { headers: authHeaders() });
      const list = Array.isArray(data?.data) ? data.data : [];
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // newest first
      setBills(list);
    } catch (error) {
      setNotice(`Could not load bills: ${errorMessage(error)}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authState.isAuthenticated) fetchBills();
  }, [authState.isAuthenticated]);

  useEffect(() => setPage(1), [search, status, from, to]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const fromTime = from ? new Date(`${from}T00:00:00`).getTime() : null;
    const toTime = to ? new Date(`${to}T23:59:59`).getTime() : null;
    return bills.filter((b) => {
      const time = new Date(b.createdAt).getTime();
      if (status !== 'all' && b.orderStatus !== status) return false;
      if (fromTime && time < fromTime) return false;
      if (toTime && time > toTime) return false;
      if (!q) return true;
      return [
        b.invoiceNumber,
        customerName(b),
        b.shippingAddress?.phone,
        b.shippingAddress?.email,
        b.user?.email,
        b.payment_id,
        b.order_id,
        ...(b.orderItems || []).map((i) => i.productName),
      ]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q));
    });
  }, [bills, search, status, from, to]);

  const summary = useMemo(() => {
    const valid = filtered.filter((b) => b.orderStatus !== 'Canceled');
    const revenue = valid.reduce((s, b) => s + b.amountPaid, 0);
    const now = new Date();
    const thisMonth = bills
      .filter((b) => b.orderStatus !== 'Canceled')
      .filter((b) => {
        const d = new Date(b.createdAt);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      })
      .reduce((s, b) => s + b.amountPaid, 0);
    return {
      count: filtered.length,
      revenue,
      average: valid.length ? revenue / valid.length : 0,
      thisMonth,
      canceled: filtered.length - valid.length,
    };
  }, [filtered, bills]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const changeStatus = async (bill, orderStatus) => {
    if (orderStatus === bill.orderStatus) return;
    setSavingId(bill._id);
    try {
      const { data } = await axios.put(`${API}/${bill._id}/status`, { orderStatus }, { headers: authHeaders() });
      const updated = { ...bill, ...data.data };
      setBills((prev) => prev.map((b) => (b._id === bill._id ? updated : b)));
      if (openBill?._id === bill._id) setOpenBill(updated);
      setNotice(`${bill.invoiceNumber} marked as ${orderStatus}.`);
    } catch (error) {
      setNotice(`Could not update status: ${errorMessage(error)}`);
    } finally {
      setSavingId(null);
    }
  };

  const exportCsv = () => {
    const header = ['Invoice No', 'Date', 'Customer', 'Phone', 'Email', 'Items', 'Subtotal', 'Adjustment', 'Amount Paid', 'Status', 'Payment ID', 'Razorpay Order ID', 'City', 'State', 'Pincode'];
    const rows = filtered.map((b) => [
      b.invoiceNumber,
      formatDate(b.createdAt, true),
      customerName(b),
      b.shippingAddress?.phone,
      b.shippingAddress?.email || b.user?.email,
      (b.orderItems || []).map((i) => `${i.productName} (${formatWeight(i.weight)}) x${i.quantity}`).join('; '),
      b.subtotal,
      b.adjustment,
      b.amountPaid,
      b.orderStatus,
      b.payment_id,
      b.order_id,
      b.shippingAddress?.city,
      b.shippingAddress?.state,
      b.shippingAddress?.pincode,
    ]);
    const csv = [header, ...rows].map((r) => r.map(toCsvCell).join(',')).join('\r\n');
    const url = URL.createObjectURL(new Blob([`﻿${csv}`], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `tajalli-bills-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (authState.authLoading) return <Loader />;
  if (!authState.isAuthenticated) return <Navigate to="/login" />;

  return (
    <div>
      <div className="billing-noprint">
        <Sidebar />
      </div>

      <div className="billing-container billing-noprint">
        <div className="billing-header">
          <h2>Billing</h2>
          <div className="billing-header__actions">
            <button onClick={fetchBills}>Refresh</button>
            <button className="billing-primary" onClick={exportCsv} disabled={filtered.length === 0}>
              Export CSV
            </button>
          </div>
        </div>

        {notice && (
          <div className="billing-notice" role="status">
            {notice}
            <button onClick={() => setNotice('')} aria-label="Dismiss">×</button>
          </div>
        )}

        <div className="billing-cards">
          <div className="billing-card">
            <span>Bills</span>
            <strong>{summary.count}</strong>
            {summary.canceled > 0 && <small>{summary.canceled} canceled</small>}
          </div>
          <div className="billing-card">
            <span>Revenue</span>
            <strong>{rupees(summary.revenue)}</strong>
            <small>excluding canceled</small>
          </div>
          <div className="billing-card">
            <span>Average bill</span>
            <strong>{rupees(summary.average)}</strong>
          </div>
          <div className="billing-card">
            <span>This month</span>
            <strong>{rupees(summary.thisMonth)}</strong>
          </div>
        </div>

        <div className="billing-filters">
          <input
            type="search"
            placeholder="Search invoice no, customer, phone, email, payment ID, product"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Status">
            <option value="all">All statuses</option>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <label>From <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} /></label>
          <label>To <input type="date" value={to} onChange={(e) => setTo(e.target.value)} /></label>
          {(search || status !== 'all' || from || to) && (
            <button onClick={() => { setSearch(''); setStatus('all'); setFrom(''); setTo(''); }}>Clear</button>
          )}
        </div>

        {loading ? (
          <Loader />
        ) : filtered.length === 0 ? (
          <div className="billing-empty">{bills.length === 0 ? 'No bills yet.' : 'No bills match these filters.'}</div>
        ) : (
          <>
            <div className="billing-table-wrap">
              <table className="billing-table">
                <thead>
                  <tr>
                    <th>Invoice No</th>
                    <th>Date</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th className="num">Amount</th>
                    <th>Payment ID</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((b) => (
                    <tr key={b._id} className={b.orderStatus === 'Canceled' ? 'is-canceled' : ''}>
                      <td className="mono">{b.invoiceNumber}</td>
                      <td>{formatDate(b.createdAt, true)}</td>
                      <td>
                        <div>{customerName(b)}</div>
                        <small>{b.shippingAddress?.phone}</small>
                      </td>
                      <td>{(b.orderItems || []).reduce((s, i) => s + (Number(i.quantity) || 0), 0)}</td>
                      <td className="num">{rupees(b.amountPaid)}</td>
                      <td className="mono small">{b.payment_id || '—'}</td>
                      <td>
                        <select
                          className={`billing-status billing-status--${b.orderStatus?.toLowerCase()}`}
                          value={b.orderStatus}
                          disabled={savingId === b._id}
                          onChange={(e) => changeStatus(b, e.target.value)}
                          aria-label={`Status of ${b.invoiceNumber}`}
                        >
                          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                      <td>
                        <button className="billing-primary" onClick={() => setOpenBill(b)}>View bill</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {pageCount > 1 && (
              <div className="billing-pager">
                <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>‹ Prev</button>
                <span>Page {page} of {pageCount}</span>
                <button disabled={page === pageCount} onClick={() => setPage((p) => p + 1)}>Next ›</button>
              </div>
            )}
          </>
        )}
      </div>

      {openBill && (
        <div className="billing-modal" role="dialog" aria-modal="true" aria-label={`Bill ${openBill.invoiceNumber}`}>
          <div className="billing-modal__box">
            <div className="billing-modal__bar billing-noprint">
              <strong>{openBill.invoiceNumber}</strong>
              <div>
                <button className="billing-primary" onClick={() => window.print()}>Print / Save PDF</button>
                <button onClick={() => setOpenBill(null)}>Close</button>
              </div>
            </div>

            <div className="invoice" id="invoice-print">
              <div className="invoice__top">
                <div>
                  <img src={logo} alt="Tajalli" className="invoice__logo" />
                  <p className="invoice__seller">
                    {SELLER.tagline}<br />
                    {SELLER.website} · {SELLER.phone}
                  </p>
                </div>
                <div className="invoice__meta">
                  <h1>INVOICE</h1>
                  <p><span>Invoice No</span>{openBill.invoiceNumber}</p>
                  <p><span>Date</span>{formatDate(openBill.createdAt, true)}</p>
                  <p><span>Status</span>{openBill.orderStatus}</p>
                </div>
              </div>

              <div className="invoice__parties">
                <div>
                  <h3>Bill to</h3>
                  <p>
                    <strong>{customerName(openBill)}</strong><br />
                    {openBill.shippingAddress?.address}<br />
                    {[openBill.shippingAddress?.city, openBill.shippingAddress?.state, openBill.shippingAddress?.pincode].filter(Boolean).join(', ')}<br />
                    {openBill.shippingAddress?.country}<br />
                    {openBill.shippingAddress?.phone}<br />
                    {openBill.shippingAddress?.email || openBill.user?.email}
                  </p>
                </div>
                <div>
                  <h3>Payment</h3>
                  <p>
                    Paid online (Razorpay)<br />
                    Payment ID: <span className="mono">{openBill.payment_id || '—'}</span><br />
                    Order ID: <span className="mono">{openBill.order_id || '—'}</span>
                    {openBill.awb_code && <><br />AWB: <span className="mono">{openBill.awb_code}</span></>}
                    {openBill.courier_name && <><br />Courier: {openBill.courier_name}</>}
                  </p>
                </div>
              </div>

              <table className="invoice__items">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Product</th>
                    <th>Weight</th>
                    <th className="num">Qty</th>
                    <th className="num">Rate</th>
                    <th className="num">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {(openBill.orderItems || []).map((item, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{item.productName}</td>
                      <td>{formatWeight(item.weight)}</td>
                      <td className="num">{item.quantity}</td>
                      <td className="num">{rupees((Number(item.price) || 0) / (Number(item.quantity) || 1))}</td>
                      <td className="num">{rupees(item.price)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="invoice__totals">
                <p><span>Subtotal</span>{rupees(openBill.subtotal)}</p>
                {openBill.adjustment !== 0 && (
                  <p>
                    <span>{openBill.adjustment > 0 ? 'Delivery & charges' : 'Discounts'}</span>
                    {openBill.adjustment > 0 ? rupees(openBill.adjustment) : `− ${rupees(-openBill.adjustment)}`}
                  </p>
                )}
                <p className="invoice__grand"><span>Amount paid</span>{rupees(openBill.amountPaid)}</p>
              </div>

              <p className="invoice__thanks">Thank you for shopping with Tajalli!</p>
            </div>

            <div className="billing-modal__status billing-noprint">
              <label>
                Order status:{' '}
                <select
                  value={openBill.orderStatus}
                  disabled={savingId === openBill._id}
                  onChange={(e) => changeStatus(openBill, e.target.value)}
                >
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Billing;
