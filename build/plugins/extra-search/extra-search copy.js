const ExtraSearch = function ExtraSearch(options = {}) {
  const {
    buttonText = 'Sök detaljplan',
    content = 'Här kan du söka efter detaljplaner.'
  } = options;

  const icon = '#fa-pencil';
  let extraSearchButton;
  let modal;
  let viewer;
  let target;

  return Origo.ui.Component({
    name: 'extra-search',

    onInit() {
      extraSearchButton = Origo.ui.Button({
        cls: 'o-extra-search padding-small icon-smaller round light box-shadow',
        click() {
          modal = Origo.ui.Modal({
            title: buttonText,
            content,
            target: viewer.getId()
          });
          this.addComponent(modal);
        },
        icon,
        tooltipText: buttonText,
        tooltipPlacement: 'east'
      });
    },

    onAdd(evt) {
      viewer = evt.target;
      if (!target) {
        target = `${viewer.getMain().getNavigation().getId()}`;
      }
      this.addComponents([extraSearchButton]);
      this.render();
    },

    render() {
      const htmlString = extraSearchButton.render();
      const el = Origo.ui.dom.html(htmlString);
      document.getElementById(target).appendChild(el);
      this.dispatch('render');
    }

    // ALternativ reder() som lägger knappen överst i listan med kontroller, kan ändras till att läggas sist (kolla om det går att styra exakt)
/*     render() {
        const htmlString = extraSearchButton.render();
        const el = Origo.ui.dom.html(htmlString);
        const nav = document.getElementById(target);

        // Lägg in knappen först
        nav.insertBefore(el, nav.firstChild);

        this.dispatch('render');
    } */
  });
};
