const BACKUP_STREAM =
    'http://storage.googleapis.com/testtopbox-public/video_content/bbb/' +
    'master.m3u8';

const TEST_CONTENT_SOURCE_ID = '2548831';
const TEST_VIDEO_ID = 'tears-of-steel';

let streamManager;

const hls = new Hls();
let videoElement;
let adUiElement;

function initPlayer() {
    videoElement = document.getElementById('video');
    videoElement.classList.remove("disabled");
    adUiElement = document.getElementById('adUi');
    streamManager =
        new google.ima.dai.api.StreamManager(videoElement, adUiElement);
    streamManager.addEventListener(
        [
            google.ima.dai.api.StreamEvent.Type.LOADED,
            google.ima.dai.api.StreamEvent.Type.ERROR,
            google.ima.dai.api.StreamEvent.Type.AD_BREAK_STARTED,
            google.ima.dai.api.StreamEvent.Type.AD_BREAK_ENDED
        ],
        onStreamEvent, false);


    hls.on(Hls.Events.FRAG_PARSING_METADATA, function (event, data) {
        if (streamManager && data) {
            data.samples.forEach(function (sample) {
                streamManager.processMetadata('ID3', sample.data, sample.pts);
            });
        }
    });

    requestVODStream(TEST_CONTENT_SOURCE_ID, TEST_VIDEO_ID, null);
}


/**
 * Requests a VOD stream with ads.
 * @param {string} cmsId
 * @param {string} videoId
 * @param {?string} apiKey
 */
function requestVODStream(cmsId, videoId, apiKey) {
    const streamRequest = new google.ima.dai.api.VODStreamRequest();
    streamRequest.contentSourceId = cmsId;
    streamRequest.videoId = videoId;
    streamRequest.apiKey = apiKey;
    streamManager.requestStream(streamRequest);
}

/**
 * Responds to a stream event.
 * @param {!google.ima.dai.api.StreamEvent} e
 */
function onStreamEvent(e) {
    switch (e.type) {
        case google.ima.dai.api.StreamEvent.Type.LOADED:
            loadUrl(e.getStreamData().url);
            break;
        case google.ima.dai.api.StreamEvent.Type.ERROR:
            console.log('Error loading stream, playing backup stream.' + e);
            loadUrl(BACKUP_STREAM);
            break;
        case google.ima.dai.api.StreamEvent.Type.AD_BREAK_STARTED:
            videoElement.controls = false;
            adUiElement.style.display = 'block';
            break;
        case google.ima.dai.api.StreamEvent.Type.AD_BREAK_ENDED:
            videoElement.controls = true;
            adUiElement.style.display = 'none';
            break;
        default:
            break;
    }
}

/**
 * Loads and plays a Url.
 * @param {string} url
 */
function loadUrl(url) {
    console.log('Loading:' + url);
    hls.loadSource(url);
    hls.attachMedia(videoElement);
    hls.on(Hls.Events.MANIFEST_PARSED, function () {
        console.log('Video Play');
        closeButtomElement = document.getElementById('close-button');
        videoDivElement = document.getElementById('videoDiv');
        videoDivElement.classList.remove("disabled");
        closeButtomElement.classList.remove("disabled");
        videoElement.play();
    });
}

function closeVideo() {
    videoElement = document.getElementById('video');
    videoDivElement = document.getElementById('videoDiv');
    closeButtomElement = document.getElementById('close-button');
    hls.attachMedia(videoElement);
    videoElement.pause();
    videoDivElement.classList.add("disabled");
    closeButtomElement.classList.add("disabled");
    document.getElementById("gameScreen").classList.remove("disabled");
}
