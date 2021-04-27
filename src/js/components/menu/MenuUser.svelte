<script>
  import { getUserState } from 'state/user';
  import NavLink from 'components/core/navLink/NavLink.svelte';

  const name = getUserState('name');
  const photo = getUserState('photo');
  const profile = getUserState('profile');
</script>

<nav
  class="txcm-menuDrawerUser">
    <a
      class="txcm-menuDrawerUserLink"
      href={$profile}>
        <img
          class="txcm-menuDrawerUserImage"
          src={$photo}
          alt={$name}>
        {$name}
    </a>
    <NavLink
      linkClass="txcm-menuDrawerUserLogout"
      to="/logout">
        <svg
          class="txcm-menuDrawerLogoutIcon">
            <use
              xlink:href="#txspt-icons-exit" />
        </svg>
    </NavLink>
</nav>
