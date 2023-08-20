let audioVCHR = new Audio('https://media.geeksforgeeks.org/wp-content/uploads/20190531135120/beep.mp3');
let audioTEXT = new Audio("https://www.soundjay.com/buttons/beep-07a.wav");

liveHr = document.querySelector('.live-request-section__list-container')

fetchHRButton = document.querySelector('#ta-help-request-dashboard > div.help-request-container > hr-tab-nav-bar > ul > li:nth-child(1) > a')

let myInterval = setInterval(callAtInterval, 5000);

function observeDisplay(targetNode, handleCode){
	var observer = new MutationObserver(function (mutations) {
		let display = targetNode.style.display;
		
		if (display != 'none') {
			handleCode();
		}
	});
	var config = { attributes: true }
	observer.observe(targetNode, config);
}

let targetNode = document.querySelector('.help-request-container')
observeDisplay(targetNode, fetchComplete);

function callAtInterval() {
	console.log('callAtInterval');
	fetchHRButton.click()
}

function probelmMeta(hr) {
	let details = {};
	let pr = hr.querySelector('.live-doubt__problem__statement>a')
	details.link = pr?.href;
	details.pr_name = pr?.innerText.trim().toLowerCase();
	details.title = hr.querySelector('.live-doubt-item-title')?.innerText.trim().toLowerCase();

	details.topic = hr.querySelector('.live-doubt__topic__title')?.innerText.toLowerCase();

	if(!details.pr_name && details.title){
		details.pr_name = details.title.substring(details.title.indexOf('(')+1, details.title.indexOf(')'));
	}
	if(!details.link && details.pr_name){
		details.link = `https://www.scaler.com/problems/${details.pr_name.replaceAll(' ', '-')}/`;
	}
	if(hr.querySelector("i.bulb-fill")){
		details.video = true;
	}
	if(hr.querySelector('g[fill-rule="evenodd"]')){
		details.text = true;
	}

	console.log(details);
	return details;
}

let problemPageOpenedMeta = {};

function fetchComplete() {
	console.log('fetchComplete');
	let liveHRS = liveHr.querySelectorAll('live-request-item');

	
	if (liveHRS.length === 0) {
		problemPageOpenedMeta = {};
	}
	
	let shouldBeep = false;
	let claimed = false;
	liveHRS.forEach((hr) => {
		let problem = probelmMeta(hr);
		let claimButton = hr.querySelector('a[data-ga-label="resolve_now_live"]');
		let claim = handleProblem(problem, claimButton);
		
		claimed = claimed|claim;

		let {text, video} = problem;
		if(!shouldBeep && text){
			shouldBeep='text';
		}
		if(video){
			shouldBeep='video';
		}
	});

	// can also use claimed
	if(shouldBeep === 'text'){
		audioTEXT.play();
	}
	if(shouldBeep === 'video'){
		audioVCHR.play();
	}
}

const autoClaimProblemTitle = [
	// Python
	// "reverse game",
	// "sum of odds - easy",
	// "easy power",
];
// all names should be in lower case
const autoClaimProblemTopic = [
	// 'python',
	// 'java',
];

function handleProblem({ link, topic, pr_name, video, text, title }, claimButton){
	let shouldClaim = false;
		
	if ((!shouldClaim) && pr_name && autoClaimProblemTitle.find((x) => { return x === pr_name })) {
		shouldClaim = true;
		console.log(`Claim pr_name:${pr_name}`);
	}
	
	if ((!shouldClaim) && topic) {
		if(autoClaimProblemTopic.find((x) => {return x===topic})){
			shouldClaim=true;
			console.log(`Claim topic: ${topic}`);
		}
	}

	console.log(`Claiming: ${shouldClaim}`);
	if (shouldClaim) {
		claimButton.style.color = 'red';
		claimButton.parentElement.style.backgroundColor = 'black';
	} else {
		if (link && !problemPageOpenedMeta[link]) {
			problemPageOpenedMeta[link] = true;
			window.open(link, "_blank");
		}
	}

	return shouldClaim;
}

audioTEXT.volume = 0.3;
audioVCHR.volume = 0.05;
// volume ranges from 0 to 1
