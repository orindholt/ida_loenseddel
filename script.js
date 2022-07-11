document.addEventListener("DOMContentLoaded", () => {
	const wrapper = document.querySelector("[data-id='table-wrapper']");

	const infoElements = wrapper.querySelectorAll("[data-id='info']");
	const infoBoxElement = wrapper.querySelector("[data-id='info-box']");
	const infoTextElement = infoBoxElement.querySelector("[data-id='info-text']");
	const infoHeaderElement = infoBoxElement.querySelector(
		"[data-id='info-header']"
	);

	const deviceType = () => {
		const ua = navigator.userAgent;
		if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
			return "tablet";
		} else if (
			/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
				ua
			)
		) {
			return "mobile";
		}
		return "desktop";
	};

	function scrollToTarget(target) {
		const scrollAmount = target.offsetTop;
		$("html, body").stop().animate({
			scrollTop: scrollAmount,
		});
	}

	if (deviceType() === "desktop") {
		// Scroll logic

		function scrollEvent(e) {
			const activeEl = wrapper.querySelector(".active");
			const nextIndex = Array.from(infoElements).indexOf(activeEl) + 1;
			const prevIndex = Array.from(infoElements).indexOf(activeEl) + -1;
			const nextEl = infoElements[nextIndex];
			const prevEl = infoElements[prevIndex];

			if (e.deltaY > 0) {
				if (nextEl) {
					moveInfoBox(nextEl);
					scrollToTarget(nextEl);
				}
			} else if (e.deltaY < 0) {
				if (prevEl) {
					moveInfoBox(prevEl);
					scrollToTarget(prevEl);
				}
			}
			// To prevent JQuery animate wobble
			e.preventDefault();
			e.stopPropagation();

			return false;
		}

		// Hover logic
		const isHover = e => e.parentElement.querySelector(":hover") === e;

		document.addEventListener("mousemove", function checkHover() {
			const hovered = isHover(wrapper);
			if (hovered !== checkHover.hovered) {
				checkHover.hovered = hovered;
				if (!hovered) {
					// Adds eventlistener when table is hovered
					wrapper.removeEventListener("wheel", scrollEvent);
				} else {
					// Removes eventlistener when table is unhovered
					wrapper.addEventListener("wheel", scrollEvent, false);
				}
			}
		});
	} else {
		// Mobile touch events
		const elementsInView = [];
		function handleTouch() {
			infoElements.forEach((el, i) => {
				if (window.scrollY > el.offsetTop) {
					if (!elementsInView.includes(el)) elementsInView.push(el);
					if (elementsInView.length)
						moveInfoBox(elementsInView[elementsInView.length - 1]);
				} else {
					if (elementsInView.includes(el)) elementsInView.pop(el);
				}
			});
		}
		document.addEventListener("touchmove", handleTouch);
	}

	// Infobox logic

	// Initial info box position
	moveInfoBox(infoElements[0]);

	// Clears the active class off all the info fields
	function clearActive() {
		infoElements.forEach(el => el.classList.remove("active"));
	}

	// Opens the info box
	function openInfoBox() {
		if (infoBoxElement.style.display !== "block") {
			infoBoxElement.style.display = "block";
			setTimeout(() => {
				infoBoxElement.style.opacity = "1";
			}, 100);
		}
	}

	// Closes the info box
	function closeInfoBox() {
		if (infoBoxElement.style.display === "block") {
			clearActive();
			infoBoxElement.style.opacity = "0";
			setTimeout(() => {
				infoBoxElement.style.display = "none";
			}, 500);
		}
	}

	// Moves the info box
	function moveInfoBox(target) {
		const infoText = target.getAttribute("data-info-data");
		const infoHeader = target.getAttribute("data-info-header");
		const elementPosY = Math.floor(target.offsetTop + 70);

		infoTextElement.textContent = infoText;
		infoHeaderElement.textContent = infoHeader;
		infoBoxElement.style.top = `${elementPosY}px`;
		clearActive();
		target.classList.add("active");
		openInfoBox();
	}

	// Click Event
	document
		.querySelector("[data-id='info-close']")
		.addEventListener("click", closeInfoBox);

	infoElements.forEach(element =>
		element.addEventListener("click", e => {
			let target = e.currentTarget;
			moveInfoBox(target);
			scrollToTarget(target);
		})
	);
});
