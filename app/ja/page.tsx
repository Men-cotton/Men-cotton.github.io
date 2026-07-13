import profileMarkdown from "../../content/profile.md?raw";
import { ProfilePage } from "../ProfilePage";

export default function JapaneseHome() {
  return <ProfilePage markdown={profileMarkdown} locale="ja" />;
}
