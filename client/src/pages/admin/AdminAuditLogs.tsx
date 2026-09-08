import React, { useEffect, useState } from 'react';
import { ShieldAlert, Search, Calendar, User, Activity } from 'lucide-react';
import { AuditAPI } from '../../api/client.js';
import { AuditLog } from '../../types/index.js';

export const AdminAuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await AuditAPI.getAll({ action: actionFilter || undefined });
      setLogs(data.logs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [actionFilter]);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Immutable Audit Logs</h1>
          <p className="text-xs text-slate-500 mt-0.5">Cryptographically logged administrative actions, logins, updates, and voids</p>
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-xs font-semibold text-slate-600">Filter Action:</label>
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2 font-medium"
          >
            <option value="">All Actions</option>
            <option value="LOGIN">LOGIN</option>
            <option value="LOGOUT">LOGOUT</option>
            <option value="CREATE_MEMBER">CREATE_MEMBER</option>
            <option value="UPDATE_MEMBER">UPDATE_MEMBER</option>
            <option value="DELETE_MEMBER">DELETE_MEMBER</option>
            <option value="CREATE_MONTHLY_CONTRIBUTION">CREATE_MONTHLY_CONTRIBUTION</option>
            <option value="VOID_MONTHLY_CONTRIBUTION">VOID_MONTHLY_CONTRIBUTION</option>
            <option value="CREATE_EXPENSE">CREATE_EXPENSE</option>
            <option value="VOID_EXPENSE">VOID_EXPENSE</option>
            <option value="UPDATE_SETTINGS">UPDATE_SETTINGS</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-600"></div>
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-16 text-slate-400 text-sm">
            No audit records found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Timestamp</th>
                  <th className="py-3.5 px-6">Admin User</th>
                  <th className="py-3.5 px-6">Action</th>
                  <th className="py-3.5 px-6">Entity</th>
                  <th className="py-3.5 px-6">IP Address</th>
                  <th className="py-3.5 px-6">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-4 px-6 text-slate-600 whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString('en-GB')}
                    </td>

                    <td className="py-4 px-6 font-semibold text-slate-900">
                      {log.user?.name || 'System / Auto'}
                    </td>

                    <td className="py-4 px-6">
                      <span className="bg-slate-100 text-slate-800 font-mono text-[10px] px-2 py-0.5 rounded font-semibold">
                        {log.action}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-slate-700">
                      {log.entityType} {log.entityId ? `#${log.entityId}` : ''}
                    </td>

                    <td className="py-4 px-6 text-slate-500 font-mono text-[11px]">
                      {log.ipAddress || '127.0.0.1'}
                    </td>

                    <td className="py-4 px-6 max-w-xs truncate text-[11px] text-slate-500">
                      {log.newValues || log.oldValues || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
