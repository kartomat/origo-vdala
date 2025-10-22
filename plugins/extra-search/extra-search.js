const ExtraSearch = function ExtraSearch(options = {}) {
  const icon = '#fa-pencil';
  let viewer;
  let target;
  let button;
  let modal;

  function renderResults(resultList, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (resultList.length === 0) {
      container.innerHTML = '<p>Inga träffar.</p>';
      return;
    }

    const html = resultList.map(res => {
      const links = ['plandok1', 'plandok2', 'plandok3', 'plandok4']
        .filter(key => res[key])
        .map(key => `${res[key]} <br />`)
        .join('');

      return `
        <div style="padding: 0.5em; border-bottom: 1px solid #ddd;">
          <strong>${res.planrubrik || res.text || 'Ingen rubrik'}</strong><br>
          <small>${res.text}</small><br>
          ${links}
        </div>
      `;
    }).join('');

    container.innerHTML = html;
  }

  function openModal() {
    const content = `
      <div style="padding: 1em;">
        <h3>Sök detaljplan</h3>
        <input id="dp-search" type="text" placeholder="Sök detaljplan..." style="width: 100%; padding: 0.5em;">
        <div id="dp-results" style="margin-top: 1em;"></div>
      </div>
    `;

    modal = Origo.ui.Modal({
      title: 'Detaljplansök',
      content,
      target: viewer.getId()
    });

    component.addComponent(modal);

    const dpInput = document.getElementById('dp-search');

    dpInput.addEventListener('keyup', async (e) => {
      const text = e.target.value.trim();
      if (text.length < 2) {
        renderResults([], 'dp-results');
        return;
      }

      try {
        //const response = await fetch(`http://localhost:3001/origoserver/search?q=${encodeURIComponent(text)}&layers[]=dp_plangrans_y`);
        const response = await fetch(`http://localhost:3001/origoserver/singlesearch?q=${encodeURIComponent(text)}`);
        const data = await response.json();
        renderResults(data, 'dp-results');
      } catch (err) {
        console.error('Fel vid sökning:', err);
        renderResults([{ planrubrik: 'Fel vid sökning' }], 'dp-results');
      }
    });
  }

  const component = Origo.ui.Component({
    name: 'extra-search',

    onInit() {
      button = Origo.ui.Button({
        cls: 'o-extra-search padding-small icon-smaller round light box-shadow',
        click() {
          openModal();
        },
        icon,
        tooltipText: 'Öppna detaljplansökning',
        tooltipPlacement: 'east'
      });
    },

    onAdd(evt) {
      viewer = evt.target;
      if (!target) {
        target = viewer.getMain().getNavigation().getId();
      }
      this.addComponents([button]);
      this.render();
    },

    render() {
      const htmlString = button.render();
      const el = Origo.ui.dom.html(htmlString);
      const nav = document.getElementById(target);
      if (nav) nav.insertBefore(el, nav.firstChild); // Lägger till knappen först i listan av controls
      this.dispatch('render');
    }
  });

  return component;
};
