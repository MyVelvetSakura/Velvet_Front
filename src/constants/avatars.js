import kero1 from "../assets/avatars/kero1.png";
import meiling1 from "../assets/avatars/meiling1.png";
import meiling2 from "../assets/avatars/meiling2.png";
import sakura1 from "../assets/avatars/sakura1.png";
import tomoyo1 from "../assets/avatars/tomoyo1.png";
import yukito1 from "../assets/avatars/yukito1.png";
import yukito2 from "../assets/avatars/yukito2.png";
import logo from "../assets/images/Logo.png";
import defaultAvatar from "../assets/images/profile_image.png";

export const AVATARS = {
  default: defaultAvatar,
  kero1: kero1,
  meiling1: meiling1,
  meiling2: meiling2,
  sakura1:sakura1,
  tomoyo1:tomoyo1,
  yukito1:yukito1,
  yukito2:yukito2,
  logo: logo,
};

export const AVATAR_OPTIONS = Object.keys(AVATARS);

export const getAvatarSrc = (key) => AVATARS[key] || AVATARS.default;