import { links, userStatusLinks } from '../assets/links';

export function getNavbarLinks(isAuth, user, inLinks = null) {
  let finalLinks = [...(inLinks ?? links)];

  if (!isAuth) {
    finalLinks.push(userStatusLinks.login, userStatusLinks.register);
  } else {
    finalLinks.push(userStatusLinks.logout);

    if (user?.membership_status === false) {
      finalLinks.push(userStatusLinks.join);
    }
    else {
      finalLinks.push(userStatusLinks.unjoin);
    }
  }

  return finalLinks;
}
