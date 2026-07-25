// Profile.tsx
import { useEffect, useState } from "react";
import { User, MapPin, Plus, Trash2, Pencil, Save, X, Home } from "lucide-react";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { BASE_API_URL } from "../../constant";

interface ProfileData {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
}

interface Address {
  id: number;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

const emptyAddressForm = {
  addressLine: "",
  city: "",
  state: "",
  pincode: "",
};

const Profile = () => {
  const token = useSelector((state: any) => state.auth?.token);
  // ASSUMPTION: user id is stored on auth state as `user.id` or `userId`.
  // Adjust this line to match your actual redux auth slice shape.
  const userId = useSelector(
    (state: any) => state.auth?.user?.id ?? state.auth?.userId
  );

  const authHeaders = { Authorization: `Bearer ${token}` };

  // ---- Profile info ----
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
  });
  const [savingProfile, setSavingProfile] = useState(false);

  // ---- Addresses ----
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState(emptyAddressForm);
  const [savingAddress, setSavingAddress] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Fetch profile
  const fetchProfile = async () => {
    if (!userId) {
      setLoadingProfile(false);
      return;
    }
    try {
      setLoadingProfile(true);
      const { data } = await axios.get(`${BASE_API_URL}/api/Profile/${userId}`, {
        headers: authHeaders,
      });
      setProfile(data);
      setProfileForm({
        fullName: data?.fullName || "",
        email: data?.email || "",
        phoneNumber: data?.phoneNumber || "",
      });
    } catch (error) {
      console.log(error);
      toast.error("Failed to load profile.");
    } finally {
      setLoadingProfile(false);
    }
  };

  // Fetch addresses
  const fetchAddresses = async () => {
    if (!token) {
      setLoadingAddresses(false);
      return;
    }
    try {
      setLoadingAddresses(true);
      const { data } = await axios.get(`${BASE_API_URL}/api/Profile/GetAddress`, {
        headers: authHeaders,
      });
      // ASSUMPTION: response is a plain array. Adjust if it's wrapped, e.g. { addresses: [...] }
      setAddresses(Array.isArray(data) ? data : data?.addresses ?? []);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load addresses.");
      setAddresses([]);
    } finally {
      setLoadingAddresses(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchAddresses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, userId]);

  // ---- Profile handlers ----
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    if (!userId) return;
    try {
      setSavingProfile(true);
      const { data } = await axios.put(
        `${BASE_API_URL}/api/Profile/${userId}`,
        profileForm,
        { headers: authHeaders }
      );
      toast.success(data?.message || "Profile updated successfully!");
      setEditingProfile(false);
      fetchProfile();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to update profile.");
      console.log(error);
    } finally {
      setSavingProfile(false);
    }
  };

  // ---- Address handlers ----
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddressForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    const { addressLine, city, state, pincode } = addressForm;
    if (!addressLine.trim() || !city.trim() || !state.trim() || !pincode.trim()) {
      toast.error("Please fill in all address fields");
      return;
    }

    try {
      setSavingAddress(true);
      const { data } = await axios.post(
        `${BASE_API_URL}/api/Profile/CreateAddress`,
        addressForm,
        { headers: authHeaders }
      );
      toast.success(data?.message || "Address added successfully!");
      setAddressForm(emptyAddressForm);
      setShowAddressForm(false);
      fetchAddresses();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to add address.");
      console.log(error);
    } finally {
      setSavingAddress(false);
    }
  };

  const handleDeleteAddress = async (id: number) => {
    if (!window.confirm("Delete this address?")) return;
    try {
      setDeletingId(id);
      const { data } = await axios.delete(
        `${BASE_API_URL}/api/Profile/DeleteAddress/${id}`,
        { headers: authHeaders }
      );
      toast.success(data?.message || "Address deleted successfully!");
      setAddresses((prev) => prev.filter((a) => a.id !== id));
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete address.");
      console.log(error);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-6 py-10 sm:px-8">
        <h1 className="text-2xl font-black tracking-tight text-gray-900 sm:text-3xl">
          My Profile
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your personal information and saved addresses
        </p>

        {/* ---------------- Profile card ---------------- */}
        <div className="mt-8 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                <User size={20} />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Personal Information</h2>
            </div>

            {!loadingProfile && !editingProfile && (
              <button
                onClick={() => setEditingProfile(true)}
                className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
              >
                <Pencil size={14} />
                Edit
              </button>
            )}
          </div>

          {loadingProfile ? (
            <div className="space-y-3">
              <div className="h-10 animate-pulse rounded-lg bg-gray-100" />
              <div className="h-10 animate-pulse rounded-lg bg-gray-100" />
              <div className="h-10 animate-pulse rounded-lg bg-gray-100" />
            </div>
          ) : !profile ? (
            <p className="py-6 text-center text-sm text-gray-400">
              Unable to load profile information.
            </p>
          ) : editingProfile ? (
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={profileForm.fullName}
                  onChange={handleProfileChange}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={profileForm.email}
                  onChange={handleProfileChange}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={profileForm.phoneNumber}
                  onChange={handleProfileChange}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setEditingProfile(false);
                    setProfileForm({
                      fullName: profile.fullName || "",
                      email: profile.email || "",
                      phoneNumber: profile.phoneNumber || "",
                    });
                  }}
                  className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  disabled={savingProfile}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-orange-500 py-2.5 text-sm font-medium text-white shadow-md transition hover:bg-orange-600 disabled:opacity-60"
                >
                  <Save size={16} />
                  {savingProfile ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Full Name
                </p>
                <p className="mt-1 text-sm font-medium text-gray-900">
                  {profile.fullName || "—"}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Email
                </p>
                <p className="mt-1 text-sm font-medium text-gray-900">
                  {profile.email || "—"}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Phone Number
                </p>
                <p className="mt-1 text-sm font-medium text-gray-900">
                  {profile.phoneNumber || "—"}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ---------------- Addresses ---------------- */}
        <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                <MapPin size={20} />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Saved Addresses</h2>
            </div>

            <button
              onClick={() => setShowAddressForm((v) => !v)}
              className="flex items-center gap-1.5 rounded-lg bg-orange-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-orange-600"
            >
              {showAddressForm ? <X size={14} /> : <Plus size={14} />}
              {showAddressForm ? "Cancel" : "Add Address"}
            </button>
          </div>

          {/* Add address form */}
          {showAddressForm && (
            <form
              onSubmit={handleAddAddress}
              className="mb-6 space-y-4 rounded-xl border border-dashed border-gray-200 p-4"
            >
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Address Line
                </label>
                <input
                  type="text"
                  name="addressLine"
                  value={addressForm.addressLine}
                  onChange={handleAddressChange}
                  placeholder="House no., street, area"
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30"
                />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={addressForm.city}
                    onChange={handleAddressChange}
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={addressForm.state}
                    onChange={handleAddressChange}
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Pincode
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={addressForm.pincode}
                    onChange={handleAddressChange}
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={savingAddress}
                className="w-full rounded-xl bg-orange-500 py-2.5 text-sm font-medium text-white shadow-md transition hover:bg-orange-600 disabled:opacity-60"
              >
                {savingAddress ? "Saving..." : "Save Address"}
              </button>
            </form>
          )}

          {/* Address list */}
          {loadingAddresses ? (
            <div className="space-y-3">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="h-20 animate-pulse rounded-xl bg-gray-100" />
              ))}
            </div>
          ) : addresses.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-10 text-center">
              <Home size={24} className="text-gray-300" />
              <p className="text-sm text-gray-400">No saved addresses yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className="flex items-start justify-between gap-4 rounded-xl border border-gray-100 p-4"
                >
                  <div className="flex gap-3">
                    <MapPin size={18} className="mt-0.5 shrink-0 text-orange-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {address.addressLine}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-500">
                        {address.city}, {address.state} - {address.pincode}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteAddress(address.id)}
                    disabled={deletingId === address.id}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-red-500 transition hover:bg-red-50 disabled:opacity-50"
                    aria-label="Delete address"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;