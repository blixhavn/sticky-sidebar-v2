# Sticky Sidebar v2 [![CI](https://github.com/blixhavn/sticky-sidebar-v2/actions/workflows/ci.yml/badge.svg)](https://github.com/blixhavn/sticky-sidebar-v2/actions/workflows/ci.yml)

Pure JavaScript plugin for making smart and high performance sticky sidebars, originally written by [Ahmed Bouhuolia](https://github.com/abouolia).

## Why the fork?
This project was forked from the original [Sticky Sidebar](https://github.com/abouolia/sticky-sidebar), written by [Ahmed Bouhuolia](https://github.com/abouolia).
As the original project is currently inactive, this fork is an attempt to revive the project and add some improvements.


## Examples
[Basic Example](https://blixhavn.github.io/sticky-sidebar-v2/examples/basic.html)

[Scrollable Sticky Element](https://blixhavn.github.io/sticky-sidebar-v2/examples/scrollable-element.html)

For complete documentation and examples see [blixhavn.github.io/sticky-sidebar-v2](http://blixhavn.github.io/sticky-sidebar-v2)


## Why is sticky sidebar so awesome?

* It does not re-calculate all dimensions when scrolling, just necessary dimensions.
* Super smooth without incurring scroll lag or jank and no page reflows.
* It has event trigger on each affix type to hook your code under particular situation.
* Handle the sidebar when is tall or too short compared to the rest of the container.
* Zero dependencies and super simple to setup.

## Install

You can download sticky sidebar v2 from Yarn, NPM or just simply download it from this page and link to the ``sticky-sidebar.js`` file in your project folder.

#### Yarn

If you are using Yarn as package manager:

````
yarn add sticky-sidebar-v2
````

#### NPM

If you are using NPM as package manager:

````
npm install sticky-sidebar-v2
````

## Usage

Your website's html structure has to be similar to this in order to work:

````html
<div class="main-content">
    <div class="sidebar">
        <div class="sidebar__inner">
            <!-- Content goes here -->
        </div>
    </div>
    <div class="content">
        <!-- Content goes here -->
    </div>
</div>
````

Note that inner sidebar wrapper ``.sidebar__inner`` is optional but highly recommended, if you don't write it yourself, the script will create one for you under class name ``inner-wrapper-sticky``. but this may cause many problems.

If your content is inside a fixed-height div with a scrollbar, this must be specified with the ``scrollContainer`` option.

For the above example, you can use the following JavaScript:

````html
<script type="text/javascript" src="./js/sticky-sidebar.js"></script>

<script type="text/javascript">
  var sidebar = new StickySidebar('.sidebar', {
    topSpacing: 20,
    bottomSpacing: 20,
    containerSelector: '.main-content',
    innerWrapperSelector: '.sidebar__inner',
    scrollContainer: '#main-viewport'
  });
</script>
````

#### Via jQuery/Zepto

You can configure sticky sidebar as a jQuery plugin, just include ``jquery.sticky-sidebar.js`` instead ``sticky-sidebar.js`` file than configure it as any jQuery plugin.

````html
<script type="text/javascript" src="./js/jquery.js"></script>
<script type="text/javascript" src="./js/jquery.sticky-sidebar.js"></script>

<script type="text/javascript">
  $('#sidebar').stickySidebar({
    topSpacing: 60,
    bottomSpacing: 60
  });
</script>
````

Make sure to include ``jquery.sticky-sidebar.js`` script file after ``jquery.js``.

#### Via a bundler

When installed from NPM, import the class:

````js
import StickySidebar from 'sticky-sidebar-v2';

const sidebar = new StickySidebar('.sidebar', {
  containerSelector: '.main-content',
  innerWrapperSelector: '.sidebar__inner'
});
````

With CommonJS, the class is the ``default`` export: ``require('sticky-sidebar-v2').default``.

The jQuery plugin looks for ``window.jQuery`` when it loads, so it is meant for ``<script>`` tags. With a bundler, use the class directly.

The module can be imported during server-side rendering (Nuxt, Next.js and similar), but only create the instance in the browser, for example in ``onMounted`` or ``useEffect``.

## Methods

``updateSticky()`` - Recalculates the cached dimensions and repositions the sidebar. Size changes of the sidebar and its container, and window resizes, are picked up automatically. Call this when the layout changes in other ways, for example when content inserted above the container moves it down.

``destroy()`` - Removes inline styles, the sticky class and all event listeners.

````js
sidebar.updateSticky();
sidebar.destroy();
````

With jQuery, pass the method name: ``$('.sidebar').stickySidebar('destroy')``.

#### Dynamic pages

If the sidebar or container element is replaced, for example on client-side navigation, destroy the old instance and create a new one for the new elements:

````js
import { onMounted, onBeforeUnmount } from 'vue';
import StickySidebar from 'sticky-sidebar-v2';

let sidebar;
onMounted(() => { sidebar = new StickySidebar('.sidebar', { containerSelector: '.main-content' }); });
onBeforeUnmount(() => sidebar.destroy());
````

## Browser Support

Sticky Sidebar v2 works in all modern browsers including Internet Explorer 9 and above, but if you want it to work with IE9, should include [`requestAnimationFrame`](https://gist.github.com/paulirish/1579671) polyfill before sticky sidebar code. For backwards compatibility, a polyfill for [ResizeObserver](https://github.com/pelotoncycle/resize-observer) can also be included.

If you have any issues with browser compatibility don’t hesitate to [Submit an issue](https://github.com/blixhavn/sticky-sidebar-v2/issues/new).

## License

Sticky Sidebar v2 is released under the MIT license. Have at it.

-------

Maintained by Øystein Blixhavn

Originally made by Ahmed Bouhuolia
