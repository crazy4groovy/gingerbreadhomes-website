/*
	Forty by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

function init($) {
	console.log('init');
	var $window = $(window),
		$body = $('body'),
		$wrapper = $('#wrapper'),
		$header = $('#header'),
		$banner = $('#banner');

	if (
		!($body.get(0))
		|| !($wrapper.get(0))
		|| !($header.get(0))
		|| !($banner.get(0))
		|| !($('#menu').get(0))
	) {
		console.log('waiting');
		setTimeout(() => init($), 100);
		return;
	}

	// Breakpoints.
	breakpoints({
		xlarge: ['1281px', '1680px'],
		large: ['981px', '1280px'],
		medium: ['737px', '980px'],
		small: ['481px', '736px'],
		xsmall: ['361px', '480px'],
		xxsmall: [null, '360px']
	});

	/**
	 * Applies parallax scrolling to an element's background image.
	 * @return {jQuery} jQuery object.
	 */
	$.fn._parallax = (browser.name == 'ie' || browser.name == 'edge' || browser.mobile) ? function () { return $(this) } : function (intensity) {

		var $window = $(window),
			$this = $(this);

		if (this.length == 0 || intensity === 0)
			return $this;

		if (this.length > 1) {

			for (var i = 0; i < this.length; i++)
				$(this[i])._parallax(intensity);

			return $this;

		}

		if (!intensity)
			intensity = 0.25;

		$this.each(function () {

			var $t = $(this),
				on, off;

			on = function () {

				$t.css('background-position', 'center 100%, center 100%, center 0px');

				$window
					.on('scroll._parallax', function () {

						var pos = parseInt($window.scrollTop()) - parseInt($t.position().top);

						$t.css('background-position', 'center ' + (pos * (-1 * intensity)) + 'px');

					});

			};

			off = function () {

				$t
					.css('background-position', '');

				$window
					.off('scroll._parallax');

			};

			breakpoints.on('<=medium', off);
			breakpoints.on('>medium', on);

		});

		$window
			.off('load._parallax resize._parallax')
			.on('load._parallax resize._parallax', function () {
				$window.trigger('scroll');
			});

		return $(this);

	};

	// Play initial animations on page load.
	$window.on('load', function () {
		window.setTimeout(function () {
			$body.removeClass('is-preload');
		}, 100);
	});

	// Clear transitioning state on unload/hide.
	$window.on('unload pagehide', function () {
		window.setTimeout(function () {
			$('.is-transitioning').removeClass('is-transitioning');
		}, 250);
	});

	// Fix: Enable IE-only tweaks.
	if (browser.name == 'ie' || browser.name == 'edge')
		$body.addClass('is-ie');

	// Scrolly.
	$('.scrolly').scrolly({
		offset: function () {
			return $header.height() - 2;
		}
	});

	// Tiles.
	var $tiles = $('.tiles > article');

	$tiles.each(function () {

		var $this = $(this),
			$image = $this.find('.image'), $img = $image.find('img'),
			$link = $this.find('.link'),
			x;

		// Image.

		// Set image.
		$this.css('background-image', 'url(' + $img.attr('src') + ')');

		// Set position.
		if (x = $img.data('position'))
			$image.css('background-position', x);

		// Hide original.
		$image.hide();

		// Link.
		if ($link.length > 0) {

			$x = $link.clone()
				.text('')
				.addClass('primary')
				.appendTo($this);

			$link = $link.add($x);

			$link.on('click', function (event) {

				var href = $link.attr('href');

				// Prevent default.
				event.stopPropagation();
				event.preventDefault();

				// Target blank?
				if ($link.attr('target') == '_blank') {

					// Open in new tab.
					window.open(href);

				}

				// Otherwise ...
				else {

					// Start transitioning.
					$this.addClass('is-transitioning');
					$wrapper.addClass('is-transitioning');

					// Redirect.
					window.setTimeout(function () {
						location.href = href;
					}, 500);

				}

			});

		}

	});

	// Header.
	if ($banner.length > 0
		&& $header.hasClass('alt')) {

		$window.on('resize', function () {
			$window.trigger('scroll');
		});

		$window.on('load', function () {

			$banner.scrollex({
				bottom: $header.height() + 10,
				terminate: function () { $header.removeClass('alt'); },
				enter: function () { $header.addClass('alt'); },
				leave: function () { $header.removeClass('alt'); $header.addClass('reveal'); }
			});

			window.setTimeout(function () {
				$window.triggerHandler('scroll');
			}, 100);

		});

	}

	// Banner.
	$banner.each(function () {

		var $this = $(this),
			$image = $this.find('.image'), $img = $image.find('img');

		// Parallax.
		$this._parallax(0.275);

		// Image.
		if ($image.length > 0) {

			// Set image.
			$this.css('background-image', 'url(' + $img.attr('src') + ')');

			// Hide original.
			$image.hide();

		}

	});

	// Menu.
	var $menu = $('#menu'),
		$menuInner;

	$menu.wrapInner('<div class="inner"></div>');
	$menuInner = $menu.children('.inner');
	$menu._locked = false;

	$menu._lock = function () {

		if ($menu._locked)
			return false;

		$menu._locked = true;

		window.setTimeout(function () {
			$menu._locked = false;
		}, 350);

		return true;

	};

	$menu._show = function () {

		if ($menu._lock())
			$body.addClass('is-menu-visible');

	};

	$menu._hide = function () {

		if ($menu._lock())
			$body.removeClass('is-menu-visible');

	};

	$menu._toggle = function () {

		if ($menu._lock())
			$body.toggleClass('is-menu-visible');

	};

	$menuInner
		.on('click', function (event) {
			event.stopPropagation();
		})
		.on('click', 'a', function (event) {

			var href = $(this).attr('href');

			event.preventDefault();
			event.stopPropagation();

			// Hide.
			$menu._hide();

			// Redirect.
			window.setTimeout(function () {
				window.location.href = href;
			}, 250);

		});

	$menu
		.appendTo($body)
		.on('click', function (event) {

			event.stopPropagation();
			event.preventDefault();

			$body.removeClass('is-menu-visible');

		})
		.append('<a class="close" href="#menu">Close</a>');

	$body
		.on('click', 'a[href="#menu"]', function (event) {

			event.stopPropagation();
			event.preventDefault();

			// Toggle.
			$menu._toggle();

		})
		.on('click', function (event) {

			// Hide.
			$menu._hide();

		})
		.on('keydown', function (event) {

			// Hide on escape.
			if (event.keyCode == 27)
				$menu._hide();

		});

	initTestimonials();
	initGallery();
}

setTimeout(() => init(jQuery), 1);

async function initTestimonials() {
	let data = await fetch("../testimonials/data.json").then((r) => r.json());
	let times = (Math.random() * data.length) | 0;
	while (--times > 0) {
		data.unshift(data.pop());
	}
	data = data.slice(0, 4);

	// Clear existing testimonials
	const testimonialSection = document.querySelector("#testimonials ul.testimonials");
	testimonialSection.innerHTML = '<ul class="alt testimonials"></ul>';
	const testimonialList = testimonialSection.querySelector('#testimonials ul.testimonials');

	data.forEach((q) => {
		const testimonialHTML = `
			<li>
				<img class="avatar" src="./testimonials/${q.avatar}"></img>
				<h3>"${q.teaser}"</h3>
				<blockquote>
				"${q.quote}"
				</blockquote>
				<p>~${q.name} ⭐⭐⭐⭐⭐</p>
			</li>
		`;
		testimonialList.insertAdjacentHTML('beforeend', testimonialHTML);
	});
}

async function initGallery() {
	const galleryImages = await fetch("../gallery/list.json")
		.then((r) => r.json());

	// console.log(JSON.stringify(galleryImages, null, 2));

	const flicking = new Flicking("#flick.gallery", {
		align: "center",
		preventDefaultOnDrag: true,
		interruptable: true,
		resizeOnContentsReady: true,
		duration: 300,
		autoResize: true,
		zIndex: 2000,
		threshold: 40,
		// Other options:
		// bound: true,
		// circular: true,
		// adaptive: true,
		// renderOnlyVisible: true,
		// easing: x => 1 - Math.pow(1 - x, 3), // Ease-out cubic
	});

	const galleryBody = galleryImages.map((img) => {
		const desc = [img.title, img.description].filter(Boolean).join(' -- ')
		return `<div class="flicking-panel">
    <img loading="lazy" alt="${desc}" title="${desc}" src=".${img.image}" draggable="false" ondragstart="return false;">
    </div>`;
	});

	function clickShowGallery() {
		if (!document.querySelector("#gallery")) return;

		flicking.append(galleryBody);

		// Wait for all images to load before resizing
		const imagePromises = Array.from(document.querySelectorAll(".flicking-panel img"))
			.map(img => {
				return new Promise(resolve => {
					if (img.complete) resolve();
					img.onload = resolve;
					img.onerror = resolve; // Ignore errors
				});
			});

		Promise.all(imagePromises).then(() => {
			flicking.resize();
		});

		document.querySelector("#gallery button.gallery-show").style.display = "none";
		document.querySelector("p.gallery-instructions").style.display = "block";
	}

	document.querySelector("#gallery button.gallery-show").onclick = clickShowGallery;
	// by default, show the gallery after 2 seconds
	setTimeout(() => {
		clickShowGallery();
	}, 2000);

}
