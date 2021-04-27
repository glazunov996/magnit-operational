<script>
  import Int from 'components/core/internationalization/Int.svelte';
  import ListGroup from 'components/list/ListGroup.svelte';
  import NavLink from 'components/core/navLink/NavLink.svelte';
  import { filterNavigationCategories } from 'utilities/listFilter';
  import { renderURL } from 'utilities/render';
  import { getUIState } from 'state/ui';
  import { location } from 'svelte-spa-router'

  const drawer = getUIState('aside');

  export let dashboard;
  export let categories;
  export let filter;

  $: filtered = filterNavigationCategories(categories, filter);

  function handleNavLinkClick() {
    $drawer = false;
  }
</script>

{#each filtered as group}
  <ListGroup
    label={group.label}
    count={filtered.length}
    length={group.length}
    {filter}>
      {#each group.indicators as indicator}
        <NavLink
          linkClass="txcm-asideNavGroupLink"
          to={!$location.endsWith('factors') || (indicator.id !== '1' && indicator.id !== '24' && indicator.id !== '20')
          ? renderURL(dashboard, indicator.url) : renderURL(dashboard, `${indicator.url}/factors`)}
          on:click={handleNavLinkClick(renderURL(dashboard, indicator.url))}
          partial={true}>
            <Int
              key={indicator.label} />
            <svg
              class="txcm-asideNavGroupLinkIcon">
                <use
                  xlink:href="#txspt-icons-checkmark" />
            </svg>
        </NavLink>
      {/each}
  </ListGroup>
{/each}
