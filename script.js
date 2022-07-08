document.addEventListener("DOMContentLoaded", () => {
	const wrapper = document.querySelector("[data-id='table-wrapper']");

	let scrollTimer,
		lastScrollFireTime = 0;

	function throttle(processScroll) {
		let minScrollTime = 400;
		let now = new Date().getTime();

		if (!scrollTimer) {
			if (now - lastScrollFireTime > 3 * minScrollTime) {
				processScroll(); // fire immediately on first scroll
				lastScrollFireTime = now;
			}
			scrollTimer = setTimeout(function () {
				scrollTimer = null;
				lastScrollFireTime = new Date().getTime();
				processScroll();
			}, minScrollTime);
		}
	}

	// Scroll Logic
	let lastScrollTop = 0;

	function disableScroll() {
		window.onwheel = function () {
			const activeEl = wrapper.querySelector(".active");
			throttle(scrollEvent);
		};
	}
	function enableScroll() {
		window.onwheel = function () {};
	}

	const getPosY = target =>
		target.getBoundingClientRect().bottom + window.scrollY;

	function scrollEvent() {
		const activeEl = wrapper.querySelector(".active");
		let st = window.scrollY;
		let directionIsUp;

		const nextIndex = Array.from(infoElements).indexOf(activeEl) + 1;
		const prevIndex = Array.from(infoElements).indexOf(activeEl) + -1;
		const nextEl = infoElements[nextIndex];
		const prevEl = infoElements[prevIndex];

		if (st > lastScrollTop) {
			directionIsUp = false;
			console.log("Down");
		} else if (st < lastScrollTop) {
			directionIsUp = true;
			console.log("Up");
		}
		if (nextEl && directionIsUp === false) {
			moveInfoBox(nextEl);
		} else if (prevEl && directionIsUp === true) {
			moveInfoBox(prevEl);
		}
		$("html, body").animate({
			scrollTop: getPosY(activeEl) / 2,
		});
		lastScrollTop = st <= 0 ? 0 : st;
	}

	// Hover Logic
	const isHover = e => e.parentElement.querySelector(":hover") === e;

	document.addEventListener("mousemove", function checkHover() {
		const hovered = isHover(wrapper);
		if (hovered !== checkHover.hovered) {
			checkHover.hovered = hovered;
			if (!hovered) {
				enableScroll();
			} else {
				disableScroll();
			}
		}
	});

	// Infobox Logic
	const infoElements = wrapper.querySelectorAll("[data-id='info']");
	const infoBoxElement = wrapper.querySelector("[data-id='info-box']");
	const infoTextElement = infoBoxElement.querySelector("[data-id='info-text']");
	const infoHeaderElement = infoBoxElement.querySelector(
		"[data-id='info-header']"
	);

	// Initial Infobox Position
	infoBoxElement.style.top = `${Math.floor(
		infoElements[0].getBoundingClientRect().bottom + window.scrollY - 190
	)}px`;
	infoTextElement.textContent = infoElements[0].getAttribute("data-info-data");
	infoHeaderElement.textContent =
		infoElements[0].getAttribute("data-info-header");

	infoElements[0].classList.add("active");
	openInfoBox();

	function clearActive() {
		infoElements.forEach(el => el.classList.remove("active"));
	}

	function openInfoBox() {
		if (infoBoxElement.style.display !== "block") {
			infoBoxElement.style.display = "block";
			setTimeout(() => {
				infoBoxElement.style.opacity = "1";
			}, 100);
		}
	}

	function closeInfoBox() {
		if (infoBoxElement.style.display === "block") {
			clearActive();
			infoBoxElement.style.opacity = "0";
			setTimeout(() => {
				infoBoxElement.style.display = "none";
			}, 500);
		}
	}

	function moveInfoBox(target) {
		const infoText = target.getAttribute("data-info-data");
		const infoHeader = target.getAttribute("data-info-header");
		const elementPosY = getPosY(target);

		infoTextElement.textContent = infoText;
		infoHeaderElement.textContent = infoHeader;
		infoBoxElement.style.top = `${Math.floor(elementPosY - 190)}px`;
		clearActive();
		target.classList.add("active");
		openInfoBox();
	}

	document
		.querySelector("[data-id='info-close']")
		.addEventListener("click", closeInfoBox);

	infoElements.forEach(element =>
		element.addEventListener("click", e => {
			moveInfoBox(e.currentTarget);
			disableScroll();
			const activeEl = wrapper.querySelector(".active");
			$("html, body")
				.stop()
				.animate({
					scrollTop: getPosY(activeEl) / 2,
				});
			console.log(getPosY(activeEl) / 2);
		})
	);
});
