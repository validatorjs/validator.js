import assertString from './util/assertString';
import isURL from './isURL';

const YoutubeVideoURL = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;

export default function isYoutubeVideoURL(str) {
  assertString(str);
  return isURL(str) && YoutubeVideoURL.test(str);
}

