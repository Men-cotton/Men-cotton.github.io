import profileMarkdown from "../content/profile.en.md?raw";
import { ProfilePage } from "./ProfilePage";

export default function Home() {
  return <ProfilePage markdown={profileMarkdown} locale="en" />;
}
