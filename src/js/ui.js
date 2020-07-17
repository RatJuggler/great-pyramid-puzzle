
  let layout   = document.getElementById('layout'),
    menu     = document.getElementById('menu'),
    menuLink = document.getElementById('menuLink');

  function toggleClass(element, className) {
    let classes = element.className.split(/\s+/),
      length = classes.length,
      i = 0;

    for (; i < length; i++) {
      if (classes[i] === className) {
        classes.splice(i, 1);
        break;
      }
    }
    // The className is not found
    if (length === classes.length) {
      classes.push(className);
    }

    element.className = classes.join(' ');
  }

  function toggleAll(e) {
    let active = 'active';

    e.preventDefault();
    toggleClass(layout, active);
    toggleClass(menu, active);
    toggleClass(menuLink, active);
  }

  menuLink.addEventListener('click', (e) => toggleAll(e));
