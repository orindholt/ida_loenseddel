document.addEventListener("DOMContentLoaded", () => {
	const wrapper = document.querySelector("[data-id='table-wrapper']");
	const langButtonElements = document.querySelectorAll(
		"[data-id='lang-button']"
	);
	let activeTable = wrapper.querySelector("table.active");
	let infoElements = activeTable.querySelectorAll("[data-id='info']");
	const typeSelectElement = document.querySelector("[data-id='select-type']");
	const infoBoxElement = wrapper.querySelector("[data-id='info-box']");
	const infoTextElement = infoBoxElement.querySelector("[data-id='info-text']");
	const infoHeaderElement = infoBoxElement.querySelector(
		"[data-id='info-header']"
	);
	const infoHeaderAltElement = infoBoxElement.querySelector(
		"[data-id='info-header-alt']"
	);
	const paginationElement = document.querySelector("[data-id='pagination']");
	const pageNumberElement = document.querySelector("[data-id='page-number']");

	let currentLang = langButtonElements[0].getAttribute("data-lang");
	let currentType = typeSelectElement.value.toLowerCase();

	let pageIndex = 0;

	// Updates the active tables
	function updateInfoElements() {
		activeTable = wrapper.querySelector("table.active");
		infoElements = activeTable.querySelectorAll("[data-id='info']");
	}
	// Type select
	typeSelectElement.addEventListener("input", e => {
		let target = e.target;
		currentType = target.value.toLowerCase();
		changeTable(`loenseddel-${currentType}`);
	});

	// Sets pagination page numbers
	function setPageNumbers() {
		const currentElement = pageNumberElement.querySelector(
			"[data-id='page-current']"
		);
		const maxElement = pageNumberElement.querySelector("[data-id='page-max']");
		const activeTableId = activeTable.getAttribute("data-id");
		const selectedTables = document.querySelectorAll(
			`[data-id='${activeTableId}']`
		);
		maxElement.textContent = selectedTables.length;
		currentElement.textContent = (pageIndex + 1).toString();
	}

	function togglePagination() {
		const hasPagination =
			activeTable.getAttribute("data-pagination") === "true";
		if (hasPagination) {
			paginationElement.style.display = "flex";
			pageNumberElement.style.display = "block";
			setPageNumbers();
		} else {
			pageNumberElement.style.display = "none";
			paginationElement.style.display = "none";
		}
	}

	// Changes the current loenseddel table
	function changeTable(type, page = 0) {
		const selectedTables = document.querySelectorAll(`[data-id='${type}']`);
		if (selectedTables) {
			updateInfoElements();
			activeTable.classList.remove("active");
			selectedTables[page].classList.add("active");
			updateInfoElements();
			togglePagination();
			moveInfoBox(infoElements[0]);
		}
	}

	// Detects device type
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

	if (deviceType() === "desktop") {
		// Scroll logic

		// Scrolls to target
		function scrollToTarget(target) {
			const rect = target.getBoundingClientRect();
			const scrollAmount = rect.top + window.scrollY - window.innerHeight / 3;
			$("html, body").stop().animate({
				scrollTop: scrollAmount,
			});
		}

		// Date for throttling
		let prevTime = Date.now();

		// Scroll event
		function scrollEvent(e) {
			const throttleAmount = 300;
			if (Date.now() > prevTime + throttleAmount) {
				prevTime = Date.now();
				updateInfoElements();
				const activeEl = activeTable.querySelector(".active");
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
			updateInfoElements();
			infoElements.forEach(el => {
				if (
					window.scrollY >
					el.offsetTop +
						window.innerHeight / (deviceType() === "tablet" ? 4 : 1.25)
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

	function changeInfoText(target) {
		if (
			target.getAttribute("data-info-dk") &&
			target.getAttribute("data-info-en")
		) {
			const infoText =
				currentLang === "dk"
					? target.getAttribute("data-info-dk")
					: target.getAttribute("data-info-en");
			infoTextElement.innerHTML = infoText;
		}
		if (
			target.getAttribute("data-header-dk") &&
			target.getAttribute("data-header-en")
		) {
			const infoHeader =
				currentLang === "dk"
					? target.getAttribute("data-header-dk")
					: target.getAttribute("data-header-en");
			infoHeaderElement.textContent = infoHeader;
		}
		if (
			target.getAttribute("data-header-dk") &&
			target.getAttribute("data-header-en")
		) {
			const infoHeaderAlt =
				currentLang === "dk"
					? target.getAttribute("data-header-en")
					: target.getAttribute("data-header-dk");
			infoHeaderAltElement.textContent = infoHeaderAlt;
		}
	}
	// Moves the info box
	function moveInfoBox(target) {
		changeInfoText(target);
		const infoBoxHeight = infoBoxElement.clientHeight;
		const windowHeight = window.innerHeight;
		// Potential bug..
		const isOverflowing =
			infoBoxHeight > windowHeight / (deviceType() === "tablet" ? 4 : 1.5);
		const infoBoxMaxWidth = parseInt(
			getComputedStyle(infoBoxElement).maxWidth.replace("px", "")
		);
		if (isOverflowing) {
			infoBoxElement.style.maxWidth = `${infoBoxMaxWidth * 1.75}px`;
		} else if (infoBoxElement.style.maxWidth)
			infoBoxElement.style.removeProperty("max-width");
		// Absolutely a bug..
		const elementPosY = Math.floor(target.offsetTop + 70);
		infoBoxElement.style.top = `${elementPosY}px`;

		clearActive();
		target.classList.add("active");
		openInfoBox();
	}

	// Close info box click
	document
		.querySelector("[data-id='info-close']")
		.addEventListener("click", closeInfoBox);
	// Initial move
	wrapper.querySelectorAll("[data-id='info']").forEach(el =>
		el.addEventListener("click", e => {
			let target = e.currentTarget;
			moveInfoBox(target);
			scrollToTarget(target);
		})
	);

	// Language click event
	langButtonElements.forEach(el => {
		el.addEventListener("click", e => {
			updateInfoElements();
			const activeEl = activeTable.querySelector(".active");
			let target = e.currentTarget;
			currentLang = target.getAttribute("data-lang");
			changeInfoText(activeEl);
		});
	});

	const paginationButtons = wrapper.querySelectorAll(
		"[data-id='pagination-button']"
	);

	function clearPaginationClass() {
		paginationButtons.forEach(el => {
			el.classList.remove("inactive");
		});
	}

	paginationButtons.forEach(el => {
		el.addEventListener("click", e => {
			let target = e.currentTarget;
			if (target.classList.contains("inactive")) return;

			const direction = target.getAttribute("data-direction");
			const activeTableId = activeTable.getAttribute("data-id");
			const selectedTables = document.querySelectorAll(
				`[data-id='${activeTableId}']`
			);

			if (direction === "next") {
				pageIndex++;
			} else if (direction === "prev") {
				pageIndex--;
			}

			if (pageIndex === selectedTables.length - 1) {
				clearPaginationClass();
				target.classList.add("inactive");
			} else if (pageIndex === 0) {
				clearPaginationClass();
				target.classList.add("inactive");
			}

			changeTable(activeTableId, pageIndex);
		});
	});
});
