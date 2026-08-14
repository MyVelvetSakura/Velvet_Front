import kero1 from "../assets/avatars/kero1.png";
import kero2 from "../assets/avatars/kero2.png";
import meiling1 from "../assets/avatars/meiling1.png";
import meiling2 from "../assets/avatars/meiling2.png";
import sakura1 from "../assets/avatars/sakura1.png";
import sakura2 from "../assets/avatars/sakura2.png";
import syaoran1 from "../assets/avatars/Syaoran1.png";
import syaoran2 from "../assets/avatars/syaoran2.png"
import tomoyo1 from "../assets/avatars/tomoyo1.png";
import tomoyo2 from "../assets/avatars/tomoyo2.png";
import yukito1 from "../assets/avatars/yukito1.png";
import yukito2 from "../assets/avatars/yukito2.png";
import Touya1 from "../assets/avatars/Touya1.png";
import Touya2 from "../assets/avatars/Touya2.png";
import yue1 from "../assets/avatars/yue1.png";
import yue2 from "../assets/avatars/yue2.png";
import logo from "../assets/images/Logo.png";
import defaultAvatar from "../assets/images/profile_image.png";

export const AVATARS = {
  default: defaultAvatar,
  kero1: kero1,
  kero2:kero2,
  meiling1: meiling1,
  meiling2: meiling2,
  sakura1:sakura1,
  sakura2:sakura2,
  syaoran1:syaoran1,
  syaoran2:syaoran2,
  tomoyo1:tomoyo1,
  tomoyo2:tomoyo2,
  yukito1:yukito1,
  yukito2:yukito2,
  Touya1:Touya1,
  Touya2:Touya2,
  yue1:yue1,
  yue2:yue2,
  logo: logo,
};

export const AVATAR_OPTIONS = Object.keys(AVATARS);

export const getAvatarSrc = (key) => AVATARS[key] || AVATARS.default;
