// image
import shadowMan from '../../public/shadow-person.jpg';
import shadowGirl from '../../public/shadow-girl.jpg';
import shadowNone from '../../public/shadow-none.png';
import shadowBoth from '../../public/shadow-both.jpg';

export const colors = [
	'#ffa39e', // dust red
	'#ffbb96', // orange
	'#ffe7ba', // light orange
	'#fff1b8', // light gold
	'#d9f7be', // light green
	'#b5f5ec', // light cyan
	'#bae7ff', // light blue
	'#efdbff', // light purple
	'#ffd6e7', // light pink
	'#e8e8e8'  // light gray
];

export const imageMapping: { [key: string]: string } = {
	0: shadowMan,
	1: shadowGirl,
	2: shadowNone,
	3: shadowBoth
};
