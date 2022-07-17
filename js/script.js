document.addEventListener("DOMContentLoaded", () => {
	const wrapper = document.querySelector("[data-id='table-wrapper']");
	const langButtonElements = document.querySelectorAll(
		"[data-id='lang-button']"
	);
	const typeSelectElement = document.querySelector("[data-id='select-type']");
	const infoElements = wrapper.querySelectorAll("[data-id='info']");
	const infoBoxElement = wrapper.querySelector("[data-id='info-box']");
	const infoTextElement = infoBoxElement.querySelector("[data-id='info-text']");
	const infoHeaderElement = infoBoxElement.querySelector(
		"[data-id='info-header']"
	);
	const infoHeaderAltElement = infoBoxElement.querySelector(
		"[data-id='info-header-alt']"
	);

	let currentLang = langButtonElements[0].getAttribute("data-lang");
	let currentType = typeSelectElement.value.toLowerCase();

	// Type select
	typeSelectElement.addEventListener("input", e => {
		let target = e.target;
		currentType = target.value.toLowerCase();
		console.log(currentType);
	});

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
		const rect = target.getBoundingClientRect();
		const scrollAmount = rect.top + window.scrollY - window.innerHeight / 4;
		$("html, body").stop().animate({
			scrollTop: scrollAmount,
		});
	}

	if (deviceType() === "desktop") {
		// Scroll logic
		let prevTime = Date.now();

		function scrollEvent(e) {
			const throttleAmount = 300;

			if (Date.now() > prevTime + throttleAmount) {
				prevTime = Date.now();
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
			}
			e.preventDefault();
			e.stopPropagation();
			return false;
		}

		// Hover logic
		const isHover = target =>
			target.parentElement.querySelector(":hover") === target;

		document.addEventListener("mousemove", function () {
			const hovered = isHover(wrapper);
			if (hovered !== this.hovered) {
				this.hovered = hovered;
				if (!hovered) {
					// Removes eventlistener when table is unhovered
					wrapper.removeEventListener("wheel", scrollEvent);
				} else {
					// Adds eventlistener when table is hovered
					wrapper.addEventListener("wheel", scrollEvent, false);
				}
			}
		});
	} else {
		// Mobile touch events
		const elementsInView = [];
		function handleTouch() {
			infoElements.forEach(el => {
				if (
					window.scrollY >
					el.offsetTop +
						window.innerHeight / (deviceType() === "tablet" ? 4 : 1)
				) {
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
		infoElements.forEach(el => {
			el.classList.remove("active");
			if (!el.classList.length) el.removeAttribute("class");
		});
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
		const infoText =
			currentLang === "dk"
				? target.getAttribute("data-info-dk")
				: target.getAttribute("data-info-en");
		const infoHeader =
			currentLang === "dk"
				? target.getAttribute("data-header-dk")
				: target.getAttribute("data-header-en");
		const infoHeaderAlt =
			currentLang === "dk"
				? target.getAttribute("data-header-en")
				: target.getAttribute("data-header-dk");
		const elementPosY = Math.floor(target.offsetTop + 70);

		infoTextElement.textContent = infoText;
		infoHeaderElement.textContent = infoHeader;
		infoHeaderAltElement.textContent = infoHeaderAlt;
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

	langButtonElements.forEach(el => {
		el.addEventListener("click", e => {
			const activeEl = wrapper.querySelector(".active");
			let target = e.currentTarget;
			currentLang = target.getAttribute("data-lang");
			moveInfoBox(activeEl);
		});
	});
});
