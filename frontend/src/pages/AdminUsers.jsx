import { useEffect, useState } from "react";
import { UserRound, ShieldCheck, UserCheck, UserX } from "lucide-react";
import { getAdminUsers } from "../services/adminService";
import LoadingSpinner from "../components/LoadingSpinner";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await getAdminUsers();
        setUsers(data);
      } catch (err) {
        console.error(err);
        setError(
          err.response?.data?.detail || "Unable to load users."
        );
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Loading users..." />;
  }

  return (
    <div className="min-h-full bg-slate-50 px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
      <div className="mx-auto max-w-7xl">

        <div className="mb-8">
          <p className="text-sm font-semibold text-blue-600">
            Administration
          </p>

          <h1 className="mt-1 text-3xl font-bold text-slate-950">
            Users
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            View all registered users in the payment system.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-200 p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                <UserRound className="h-5 w-5 text-blue-600" />
              </div>

              <div>
                <h2 className="font-semibold text-slate-900">
                  Registered Users
                </h2>

                <p className="text-xs text-slate-500">
                  {users.length} users found
                </p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">

              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-left">
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    User
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Email
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Role
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Status
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Created
                  </th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-slate-100 hover:bg-slate-50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50">
                          {user.is_admin ? (
                            <ShieldCheck className="h-5 w-5 text-blue-600" />
                          ) : (
                            <UserRound className="h-5 w-5 text-slate-500" />
                          )}
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            {user.name}
                          </p>

                          <p className="text-xs text-slate-400">
                            ID #{user.id}
                          </p>
                        </div>

                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {user.email}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          user.is_admin
                            ? "bg-blue-50 text-blue-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {user.is_admin ? "Admin" : "Customer"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      {user.is_active ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                          <UserCheck className="h-3.5 w-3.5" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
                          <UserX className="h-3.5 w-3.5" />
                          Inactive
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(user.created_at).toLocaleDateString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;