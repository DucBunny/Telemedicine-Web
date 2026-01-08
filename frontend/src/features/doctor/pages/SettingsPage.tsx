import { Profile } from '../components/settings/Profile'
import { Preferences } from '../components/settings/Preferences'

export const SettingsPage = () => {
  return (
    <div className="mx-auto space-y-4 md:space-y-6">
      <Profile />

      <Preferences />
    </div>
  )
}
