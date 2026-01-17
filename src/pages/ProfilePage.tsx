import { useState } from 'react'
import { User, Mail, Phone, Star, Car, Edit2, Save } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { authApi } from '../services/api'

export default function ProfilePage() {
  const { user, logout } = useAuthStore()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone_number: user?.phone_number || '',
  })

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await authApi.updateProfile(formData)
      alert('Profile updated successfully!')
      setIsEditing(false)
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">Profile</h1>

      <div className="bg-white rounded-2xl shadow-card p-6 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center">
            <span className="text-3xl font-bold text-primary-main">{user?.name?.charAt(0)?.toUpperCase() || 'U'}</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-neutral-900">{user?.name}</h2>
            <p className="text-neutral-500">@{user?.username}</p>
            <div className="flex items-center gap-1 mt-1">
              <Star className="w-4 h-4 text-special-gold fill-special-gold" />
              <span className="text-sm font-medium">{user?.rating?.toFixed(1) || '5.0'}</span>
              <span className="text-sm text-neutral-500">• {user?.total_rides || 0} rides</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {isEditing ? (
            <>
              <Input label="Full Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} leftIcon={User} />
              <Input label="Phone Number" value={formData.phone_number} onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })} leftIcon={Phone} />
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setIsEditing(false)}>Cancel</Button>
                <Button className="flex-1" onClick={handleSave} loading={isSaving}><Save className="w-4 h-4 mr-2" />Save</Button>
              </div>
            </>
          ) : (
            <>
              <ProfileItem icon={Mail} label="Email" value={user?.email || ''} />
              <ProfileItem icon={Phone} label="Phone" value={user?.phone_number || 'Not provided'} />
              <ProfileItem icon={Car} label="Total Rides" value={`${user?.total_rides || 0} rides`} />
              <Button variant="outline" className="w-full" onClick={() => setIsEditing(true)}><Edit2 className="w-4 h-4 mr-2" />Edit Profile</Button>
            </>
          )}
        </div>
      </div>

      <Button variant="outline" className="w-full text-status-error border-status-error hover:bg-status-error/10" onClick={logout}>
        Sign Out
      </Button>
    </div>
  )
}

function ProfileItem({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-neutral-100 last:border-0">
      <Icon className="w-5 h-5 text-neutral-400" />
      <div>
        <p className="text-xs text-neutral-500">{label}</p>
        <p className="font-medium text-neutral-900">{value}</p>
      </div>
    </div>
  )
}
