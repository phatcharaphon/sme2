/* global describe it cy beforeEach require afterEach */

var helper = require('../../common/helper');
var ceHelper = require('../../common/contenteditable_helper');
// var repairHelper = require('../../common/repair_document_helper');

describe(['tagdesktop', 'tagnextcloud', 'tagproxy'], 'Editable area - Empty paragraph', function() {
	var testFileName = 'undo_redo.odt';

	beforeEach(function () {
		helper.beforeAll(testFileName, 'writer');
		cy.cGet('div.clipboard').as('clipboard');
	});

	afterEach(function () {
		helper.afterAll(testFileName, this.currentTest.state);
	});

	it('Typing in an empty paragraph', function () {
		// initial position
		ceHelper.checkHTMLContent('');
		ceHelper.checkCaretPosition(0);
		// typing
		// ceHelper.type('Hello World');
		// ceHelper.checkHTMLContent('Hello World');
		// ceHelper.checkCaretPosition(11);

		ceHelper.type('H');
		ceHelper.checkHTMLContent('H');
		ceHelper.checkCaretPosition(1);
	});

	it('Typing <backspace> in an empty paragraph', function () {
		// initial position
		ceHelper.checkHTMLContent('');
		ceHelper.checkCaretPosition(0);
		// typing
		ceHelper.type('{backspace}');
		ceHelper.checkHTMLContent('');
		ceHelper.checkCaretPosition(0);
	});

	it('Typing <delete> in an empty paragraph', function () {
		// initial position
		ceHelper.checkHTMLContent('');
		ceHelper.checkCaretPosition(0);
		// typing
		ceHelper.type('{del}');
		ceHelper.checkHTMLContent('');
		ceHelper.checkCaretPosition(0);
	});
});

describe(['tagdesktop', 'tagnextcloud', 'tagproxy'], 'Editable area - Basic typing and caret moving', function() {
	var testFileName = 'undo_redo.odt';

	beforeEach(function () {
		helper.beforeAll(testFileName, 'writer');
		cy.cGet('div.clipboard').as('clipboard');
	});

	afterEach(function () {
		helper.afterAll(testFileName, this.currentTest.state);
	});

	it('Moving inside paragraph', function () {
		// initial position
		ceHelper.checkHTMLContent('');
		ceHelper.checkCaretPosition(0);
		// typing
		ceHelper.type('Hello World');
		ceHelper.checkHTMLContent('Hello World');
		ceHelper.checkCaretPosition(11);
		// move left
		ceHelper.moveCaret('left', '', 5);
		ceHelper.checkCaretPosition(6);
		helper.getBlinkingCursorPosition('P');
		// try to move beyond paragraph begin
		ceHelper.moveCaret('home');
		ceHelper.checkCaretPosition(0);
		ceHelper.moveCaret('left');
		ceHelper.checkCaretPosition(0);
		// move right
		ceHelper.moveCaret('right', '', 2);
		ceHelper.checkCaretPosition(2);
		// try to move beyond paragraph end
		ceHelper.moveCaret('end');
		ceHelper.checkCaretPosition(11);
		ceHelper.moveCaret('right');
		ceHelper.checkCaretPosition(11);
		// click on text
		helper.clickAt('P');
		ceHelper.checkCaretPosition(6);
	});

	it('Moving between paragraphs', function () {
		// typing paragraph 1
		ceHelper.type('Hello World');
		ceHelper.checkPlainContent('Hello World');
		// paragraph 2 (empty)
		ceHelper.type('{enter}');
		ceHelper.checkPlainContent('');
		// paragraph 3 (empty)
		ceHelper.type('{enter}');
		ceHelper.checkPlainContent('');
		helper.getBlinkingCursorPosition('P1');
		// typing paragraph 4
		ceHelper.type('{enter}');
		ceHelper.type('green red');
		ceHelper.checkPlainContent('green red');
		ceHelper.moveCaret('left', '', 4);
		ceHelper.checkCaretPosition(5);
		helper.getBlinkingCursorPosition('P2');
		// move up to paragraph 3
		ceHelper.moveCaret('up');
		ceHelper.checkPlainContent('');
		ceHelper.checkCaretPosition(0);
		// move back to paragraph 4
		ceHelper.moveCaret('down');
		ceHelper.checkPlainContent('green red');
		ceHelper.checkCaretPosition(5);
		// move up to paragraph 1
		ceHelper.moveCaret('up', '', 3);
		ceHelper.checkPlainContent('Hello World');
		// click on paragraph 3
		helper.clickAt('P1');
		ceHelper.checkPlainContent('');
		ceHelper.checkCaretPosition(0);
		// click on paragraph 4
		helper.clickAt('P2');
		ceHelper.checkPlainContent('green red');
		ceHelper.checkCaretPosition(5);
		// try to move beyond last paragraph
		ceHelper.moveCaret('down');
		ceHelper.checkPlainContent('green red');
		ceHelper.checkCaretPosition(9);
		// try to move beyond first paragraph
		ceHelper.moveCaret('up', '', 4);
		ceHelper.checkPlainContent('Hello World');
		ceHelper.checkCaretPosition(0);
	});

	it('Typing at paragraph beginning', function () {
		ceHelper.type('Hello World');
		ceHelper.checkPlainContent('Hello World');
		ceHelper.moveCaret('home');
		ceHelper.checkCaretPosition(0);
		ceHelper.type('k');
		ceHelper.checkHTMLContent('kHello World');
		ceHelper.checkCaretPosition(1);
	});

	it('Typing <delete> at paragraph beginning', function () {
		ceHelper.type('Hello World');
		ceHelper.checkPlainContent('Hello World');
		ceHelper.moveCaret('home');
		ceHelper.checkCaretPosition(0);
		ceHelper.type('{del}');
		ceHelper.checkHTMLContent('ello World');
		ceHelper.checkCaretPosition(0);
	});

	it('Typing <enter>', function () {
		// typing 4 paragraphs
		ceHelper.type('Hello World');
		ceHelper.checkPlainContent('Hello World');
		ceHelper.type('{enter}');
		ceHelper.checkPlainContent('');
		ceHelper.type('{enter}');
		ceHelper.checkPlainContent('');
		ceHelper.type('{enter}');
		ceHelper.type('green red');
		ceHelper.checkPlainContent('green red');
		// move current paragraph one line below
		ceHelper.moveCaret('home');
		ceHelper.type('{enter}');
		ceHelper.checkPlainContent('green red');
		// move to first paragraph
		ceHelper.moveCaret('up', '', 4);
		// split paragraph
		ceHelper.moveCaret('right', '', 5);
		ceHelper.type('{enter}');
		ceHelper.checkPlainContent(' World');
		ceHelper.moveCaret('up');
		ceHelper.checkPlainContent('Hello');
	});

	it('Typing <backspace>', function () {
		ceHelper.type('Hello World');
		ceHelper.checkPlainContent('Hello World');
		ceHelper.type('{enter}');
		// delete empty paragraph
		ceHelper.type('{enter}');
		ceHelper.type('{backspace}');
		ceHelper.checkPlainContent('');
		ceHelper.checkCaretPosition(0);
		// type new paragraph
		ceHelper.type('{enter}');
		ceHelper.type('green red');
		// move paragraph one line above
		ceHelper.moveCaret('home');
		ceHelper.type('{backspace}');
		ceHelper.checkPlainContent('green red');
		ceHelper.checkCaretPosition(0);
		// merge with above paragraph
		ceHelper.type('{backspace}');
		ceHelper.checkPlainContent('Hello Worldgreen red');
		ceHelper.checkCaretPosition(11);
		// try to delete beyond first paragraph begin
		ceHelper.moveCaret('home');
		ceHelper.type('{backspace}');
		ceHelper.checkHTMLContent('Hello Worldgreen red');
		ceHelper.checkCaretPosition(0);
		// type after <backspace> at paragraph begin
		ceHelper.type('k');
		ceHelper.checkHTMLContent('kHello Worldgreen red');
		ceHelper.checkCaretPosition(1);
	});

	it('Typing <delete>', function () {
		ceHelper.type('Hello World');
		ceHelper.checkPlainContent('Hello World');
		ceHelper.type('{enter}');
		// delete empty paragraph
		ceHelper.type('{enter}');
		ceHelper.moveCaret('up');
		ceHelper.type('{del}');
		ceHelper.checkPlainContent('');
		ceHelper.checkCaretPosition(0);
		// type new paragraph
		ceHelper.type('{enter}');
		ceHelper.type('green red');
		// delete empty paragraph
		ceHelper.type('{enter}');
		ceHelper.moveCaret('up');
		ceHelper.moveCaret('end');
		ceHelper.type('{del}');
		ceHelper.checkPlainContent('green red');
		ceHelper.checkCaretPosition(9);
		// move paragraph one line above
		ceHelper.moveCaret('up');
		ceHelper.type('{del}');
		ceHelper.checkPlainContent('green red');
		ceHelper.checkCaretPosition(0);
		// merge with above paragraph
		ceHelper.moveCaret('up');
		ceHelper.moveCaret('end');
		ceHelper.type('{del}');
		ceHelper.checkPlainContent('Hello Worldgreen red');
		ceHelper.checkCaretPosition(11);
		// try to delete beyond paragraph end
		ceHelper.moveCaret('end');
		ceHelper.type('{del}');
		ceHelper.checkHTMLContent('Hello Worldgreen red');
		ceHelper.checkCaretPosition(20);
		// type after <delete> at paragraph end
		ceHelper.type('k');
		ceHelper.checkHTMLContent('Hello Worldgreen redk');
		ceHelper.checkCaretPosition(21);
	});

	it('Preserving spaces', function () {
		ceHelper.type('Hello     World   ');
		ceHelper.checkPlainContent('Hello     World   ');
		ceHelper.type('{enter}');
		ceHelper.type('   ');
		ceHelper.checkPlainContent('   ');
		// check that spaces are preserved when moving between paragraphs
		ceHelper.moveCaret('up');
		ceHelper.checkPlainContent('Hello     World   ');
		// check that spaces are preserved after a <backspace>
		ceHelper.moveCaret('end');
		ceHelper.type('{backspace}');
		ceHelper.checkPlainContent('Hello     World  ');
		// check that spaces are preserved after a <delete>
		ceHelper.moveCaret('down');
		ceHelper.checkPlainContent('   ');
		ceHelper.moveCaret('home');
		ceHelper.type('{del}');
		ceHelper.checkPlainContent('  ');
		// check that spaces are preserved after a paragraph splitting
		ceHelper.moveCaret('up');
		ceHelper.moveCaret('right', '', 7);
		ceHelper.type('{enter}');
		ceHelper.checkPlainContent('   World  ');
		ceHelper.moveCaret('up');
		ceHelper.checkPlainContent('Hello  ');
		// check that spaces are preserved after a paragraph merging (<backspace>)
		ceHelper.moveCaret('down');
		ceHelper.type('{backspace}');
		ceHelper.checkPlainContent('Hello     World  ');
		// check that spaces are preserved after a paragraph merging (<delete>)
		ceHelper.type('{enter}');
		ceHelper.moveCaret('up');
		ceHelper.moveCaret('end');
		ceHelper.type('{del}');
		ceHelper.checkPlainContent('Hello     World  ');
	});

	it('Preserving <tab>s', function () {
		ceHelper.type('Hello\t\tWorld\t\t');
		ceHelper.checkPlainContent('Hello\t\tWorld\t\t');
		ceHelper.type('{enter}');
		ceHelper.type('\t\t');
		ceHelper.checkPlainContent('\t\t');
		// check that tabs are preserved when moving between paragraphs
		ceHelper.moveCaret('up');
		ceHelper.checkPlainContent('Hello\t\tWorld\t\t');
		// check that tabs are preserved after a <backspace>
		ceHelper.moveCaret('end');
		ceHelper.type('{backspace}');
		ceHelper.checkPlainContent('Hello\t\tWorld\t');
		// check that tabs are preserved after a <delete>
		ceHelper.moveCaret('down');
		ceHelper.checkPlainContent('\t\t');
		ceHelper.moveCaret('home');
		ceHelper.type('{del}');
		ceHelper.checkPlainContent('\t');
		// check that tabs are preserved after a paragraph splitting
		ceHelper.moveCaret('up');
		ceHelper.moveCaret('right', '', 6);
		ceHelper.type('{enter}');
		ceHelper.checkPlainContent('\tWorld\t');
		ceHelper.moveCaret('up');
		ceHelper.checkPlainContent('Hello\t');
		// check that tabs are preserved after a paragraph merging (<backspace>)
		ceHelper.moveCaret('down');
		ceHelper.type('{backspace}');
		ceHelper.checkPlainContent('Hello\t\tWorld\t');
		// check that tabs are preserved after a paragraph merging (<delete>)
		ceHelper.type('{enter}');
		ceHelper.moveCaret('up');
		ceHelper.moveCaret('end');
		ceHelper.type('{del}');
		ceHelper.checkPlainContent('Hello\t\tWorld\t');
	});

	it('Preserving line breaks', function () {
		ceHelper.type('Hello World');
		ceHelper.checkPlainContent('Hello World');
		ceHelper.moveCaret('left', '', 6);
		ceHelper.type('{shift+enter}');
		ceHelper.checkPlainContent('Hello\n World');
		ceHelper.checkCaretPosition(6);
		ceHelper.type('{backspace}');
		ceHelper.checkPlainContent('Hello World');
		ceHelper.type('{shift+enter}');
		ceHelper.moveCaret('left');
		ceHelper.type('{del}');
		ceHelper.checkPlainContent('Hello World');
	});
});

describe(['tagdesktop', 'tagnextcloud', 'tagproxy'], 'Editable area - Inner selection', function() {
	var testFileName = 'undo_redo.odt';

	beforeEach(function () {
		helper.beforeAll(testFileName, 'writer');
		cy.cGet('div.clipboard').as('clipboard');
	});

	afterEach(function () {
		helper.afterAll(testFileName, this.currentTest.state);
	});

	it('Selecting inside paragraph', function () {
		ceHelper.type('Hello World');
		ceHelper.checkPlainContent('Hello World');
		// select left-word
		ceHelper.moveCaret('left', 'shift', 5);
		ceHelper.checkSelectionRange(11, 6);
		ceHelper.moveCaret('right');
		ceHelper.checkSelectionIsNull();
		ceHelper.checkCaretPosition(7);
		helper.getBlinkingCursorPosition('P');
		// select right-ward
		ceHelper.moveCaret('right', 'shift', 4);
		ceHelper.checkSelectionRange(7, 11);
		ceHelper.moveCaret('left');
		ceHelper.checkSelectionIsNull();
		ceHelper.checkCaretPosition(10);
		// select from end to start
		ceHelper.moveCaret('end');
		ceHelper.moveCaret('home', 'shift');
		ceHelper.checkSelectionRange(11, 0);
		// clear selection with a click
		helper.clickAt('P');
		ceHelper.checkSelectionIsNull();
		ceHelper.checkCaretPosition(7);
		// select 'World' by a double click
		helper.clickAt('P', true);
		ceHelper.checkSelectionRange(6, 11);
		// check empty selection
		ceHelper.moveCaret('left', 'shift', 5);
		ceHelper.checkSelectionIsEmpty(6);
		ceHelper.moveCaret('left', 'shift');
		ceHelper.checkSelectionRange(5, 6);
		ceHelper.moveCaret('right', 'shift');
		ceHelper.checkSelectionIsEmpty(6);
	});

	it('Deselect a selection ending at the end of the paragraph', function () {
		ceHelper.type('Hello World');
		ceHelper.checkPlainContent('Hello World');
		ceHelper.select(6, 11);
		ceHelper.moveCaret('right');
		ceHelper.checkSelectionIsNull();
		ceHelper.checkCaretPosition(11);
	});

	it('Typing with selection inside paragraph', function () {
		ceHelper.type('Green and red');
		ceHelper.checkPlainContent('Green and red');
		// type in a right-ward selection
		ceHelper.select(6, 9);
		ceHelper.type('o');
		ceHelper.checkPlainContent('Green o red');
		ceHelper.checkCaretPosition(7);
		ceHelper.checkSelectionIsNull();
		ceHelper.type('r');
		// type in a left-ward selection
		ceHelper.select(8, 6);
		ceHelper.type('a');
		ceHelper.checkPlainContent('Green a red');
		ceHelper.checkCaretPosition(7);
		ceHelper.checkSelectionIsNull();
		ceHelper.type('nd');
		// type the same char, the selection starts with
		ceHelper.select(6, 9);
		ceHelper.type('a');
		ceHelper.checkPlainContent('Green a red');
		ceHelper.checkCaretPosition(7);
		ceHelper.checkSelectionIsNull();
	});

	it('Typing <enter> with selection inside paragraph', function () {
		ceHelper.type('Green and red');
		ceHelper.checkPlainContent('Green and red');
		// type <enter> in a right-ward selection
		ceHelper.select(6, 9);
		ceHelper.type('{enter}');
		ceHelper.checkPlainContent(' red');
		ceHelper.checkCaretPosition(0);
		ceHelper.checkSelectionIsNull();
		ceHelper.moveCaret('up');
		ceHelper.checkPlainContent('Green ');
		ceHelper.moveCaret('end');
		ceHelper.type('and');
		ceHelper.type('{del}');
		ceHelper.checkPlainContent('Green and red');
		// type <enter> in a left-ward selection
		ceHelper.select(9, 6);
		ceHelper.type('{enter}');
		ceHelper.checkPlainContent(' red');
		ceHelper.checkCaretPosition(0);
		ceHelper.checkSelectionIsNull();
		ceHelper.moveCaret('up');
		ceHelper.checkPlainContent('Green ');
	});

	it('Typing <backspace> with selection inside paragraph', function () {
		ceHelper.type('Green and red');
		ceHelper.checkPlainContent('Green and red');
		// type <backspace> in a right-ward selection
		ceHelper.select(6, 9);
		ceHelper.type('{backspace}');
		ceHelper.checkPlainContent('Green  red');
		ceHelper.checkCaretPosition(6);
		ceHelper.checkSelectionIsNull();
		ceHelper.type('and');
		// type <backspace> in a left-ward selection
		ceHelper.select(9, 6);
		ceHelper.type('{backspace}');
		ceHelper.checkPlainContent('Green  red');
		ceHelper.checkCaretPosition(6);
		ceHelper.checkSelectionIsNull();
	});

	it('Typing <delete> with selection inside paragraph', function () {
		ceHelper.type('Green and red');
		ceHelper.checkPlainContent('Green and red');
		// type <delete> in a right-ward selection
		ceHelper.select(6, 9);
		ceHelper.type('{del}');
		ceHelper.checkPlainContent('Green  red');
		ceHelper.checkCaretPosition(6);
		ceHelper.checkSelectionIsNull();
		ceHelper.type('and');
		// type <delete> in a left-ward selection
		ceHelper.select(9, 6);
		ceHelper.type('{del}');
		ceHelper.checkPlainContent('Green  red');
		ceHelper.checkCaretPosition(6);
		ceHelper.checkSelectionIsNull();
	});
});

describe(['tagdesktop', 'tagnextcloud', 'tagproxy'], 'Editable area - Multi-paragraph selection', function() {
	var testFileName = 'undo_redo.odt';

	beforeEach(function () {
		helper.beforeAll(testFileName, 'writer');
		cy.cGet('div.clipboard').as('clipboard');
	});

	afterEach(function () {
		helper.afterAll(testFileName, this.currentTest.state);
	});

	it('Selection starts in previous paragraph', function () {
		ceHelper.type('Hello World');
		ceHelper.type('{enter}');
		ceHelper.type('{enter}');
		ceHelper.type('Green red');
		ceHelper.checkPlainContent('Green red');
		ceHelper.moveCaret('up', '', 2);
		ceHelper.moveCaret('home');
		ceHelper.moveCaret('right', '', 5);
		ceHelper.moveCaret('right', 'shift', 13);
		ceHelper.checkPlainContent('Green red');
		ceHelper.checkSelectionRange(0, 5);
	});

	it('Typing with selection starting in previous paragraph', function () {
		ceHelper.type('Hello World');
		ceHelper.type('{enter}');
		ceHelper.type('{enter}');
		ceHelper.type('Green red');
		ceHelper.moveCaret('up', '', 2);
		ceHelper.moveCaret('home');
		ceHelper.moveCaret('right', '', 5);
		ceHelper.moveCaret('right', 'shift', 13);
		ceHelper.type('s');
		ceHelper.checkPlainContent('Hellos red');
		ceHelper.checkSelectionIsNull();
		ceHelper.checkCaretPosition(6);
	});

	it('Typing <enter> with selection starting in previous paragraph', function () {
		ceHelper.type('Hello World');
		ceHelper.type('{enter}');
		ceHelper.type('{enter}');
		ceHelper.type('Green red');
		ceHelper.moveCaret('up', '', 2);
		ceHelper.moveCaret('home');
		ceHelper.moveCaret('right', '', 5);
		ceHelper.moveCaret('right', 'shift', 13);
		ceHelper.type('{enter}');
		ceHelper.checkPlainContent(' red');
		ceHelper.checkSelectionIsNull();
		ceHelper.checkCaretPosition(0);
		ceHelper.moveCaret('up');
		ceHelper.checkPlainContent('Hello');
	});

	it('Typing <backspace> with selection starting in previous paragraph', function () {
		ceHelper.type('Hello World');
		ceHelper.type('{enter}');
		ceHelper.type('{enter}');
		ceHelper.type('Green red');
		ceHelper.moveCaret('up', '', 2);
		ceHelper.moveCaret('home');
		ceHelper.moveCaret('right', '', 5);
		ceHelper.moveCaret('right', 'shift', 13);
		ceHelper.type('{backspace}');
		ceHelper.checkPlainContent('Hello red');
		ceHelper.checkSelectionIsNull();
		ceHelper.checkCaretPosition(5);
	});

	it('Typing <delete> with selection starting in previous paragraph', function () {
		ceHelper.type('Hello World');
		ceHelper.type('{enter}');
		ceHelper.type('{enter}');
		ceHelper.type('Green red');
		ceHelper.moveCaret('up', '', 2);
		ceHelper.moveCaret('home');
		ceHelper.moveCaret('right', '', 5);
		ceHelper.moveCaret('right', 'shift', 13);
		ceHelper.type('{del}');
		ceHelper.checkPlainContent('Hello red');
		ceHelper.checkSelectionIsNull();
		ceHelper.checkCaretPosition(5);
	});

	it('Selection ends in next paragraph', function () {
		ceHelper.type('Hello World');
		ceHelper.type('{enter}');
		ceHelper.type('{enter}');
		ceHelper.type('Green red');
		ceHelper.checkPlainContent('Green red');
		ceHelper.moveCaret('left', '', 3);
		ceHelper.moveCaret('left', 'shift', 13);
		ceHelper.checkPlainContent('Hello World');
		ceHelper.checkSelectionRange(6, 11);
	});

	it('Typing with selection ending in next paragraph', function () {
		ceHelper.type('Hello World');
		ceHelper.type('{enter}');
		ceHelper.type('{enter}');
		ceHelper.type('Green red');
		ceHelper.moveCaret('left', '', 3);
		ceHelper.moveCaret('left', 'shift', 13);
		ceHelper.type('b');
		ceHelper.checkPlainContent('Hello bred');
		ceHelper.checkSelectionIsNull();
		ceHelper.checkCaretPosition(7);
	});

	it('Typing <enter> with selection ending in next paragraph', function () {
		ceHelper.type('Hello World');
		ceHelper.type('{enter}');
		ceHelper.type('{enter}');
		ceHelper.type('Green red');
		ceHelper.moveCaret('left', '', 3);
		ceHelper.moveCaret('left', 'shift', 13);
		ceHelper.type('{enter}');
		ceHelper.checkPlainContent('red');
		ceHelper.checkSelectionIsNull();
		ceHelper.checkCaretPosition(0);
		ceHelper.moveCaret('up');
		ceHelper.checkPlainContent('Hello ');
	});

	it('Typing <backspace> with selection ending in next paragraph', function () {
		ceHelper.type('Hello World');
		ceHelper.type('{enter}');
		ceHelper.type('{enter}');
		ceHelper.type('Green red');
		ceHelper.moveCaret('left', '', 3);
		ceHelper.moveCaret('left', 'shift', 13);
		ceHelper.type('{backspace}');
		ceHelper.checkPlainContent('Hello red');
		ceHelper.checkSelectionIsNull();
		ceHelper.checkCaretPosition(6);
	});

	it('Typing <delete> with selection ending in next paragraph', function () {
		ceHelper.type('Hello World');
		ceHelper.type('{enter}');
		ceHelper.type('{enter}');
		ceHelper.type('Green red');
		ceHelper.moveCaret('left', '', 3);
		ceHelper.moveCaret('left', 'shift', 13);
		ceHelper.type('{del}');
		ceHelper.checkPlainContent('Hello red');
		ceHelper.checkSelectionIsNull();
		ceHelper.checkCaretPosition(6);
	});
});

describe(['tagdesktop', 'tagnextcloud', 'tagproxy'], 'Editable area - Empty selection', function() {
	var testFileName = 'undo_redo.odt';

	beforeEach(function () {
		helper.beforeAll(testFileName, 'writer');
		cy.cGet('div.clipboard').as('clipboard');
	});

	afterEach(function () {
		helper.afterAll(testFileName, this.currentTest.state);
	});

	it('Typing <backspace> with empty selection', function () {
		ceHelper.type('Green red');
		ceHelper.checkPlainContent('Green red');
		ceHelper.select(6, 7);
		ceHelper.moveCaret('left', 'shift');
		ceHelper.checkSelectionIsEmpty(6);
		ceHelper.type('or ');
		ceHelper.checkSelectionIsEmpty(9);
		ceHelper.type('{backspace}');
		ceHelper.checkPlainContent('Green orred');
		ceHelper.checkCaretPosition(8);
		ceHelper.checkSelectionIsNull();
		ceHelper.select(7, 6);
		ceHelper.moveCaret('right', 'shift');
		ceHelper.checkSelectionIsEmpty(7);
		ceHelper.type('{backspace}');
		ceHelper.checkPlainContent('Green rred');
		ceHelper.checkCaretPosition(6);
		ceHelper.checkSelectionIsNull();
	});

	it('Typing <backspace> with empty selection at the start of the paragraph', function () {
		ceHelper.type('Hello World');
		ceHelper.type('{enter}');
		ceHelper.type('Green red');
		ceHelper.moveCaret('home');
		ceHelper.moveCaret('right', 'shift');
		ceHelper.moveCaret('left', 'shift');
		ceHelper.checkPlainContent('Green red');
		ceHelper.checkSelectionIsEmpty(0);
		ceHelper.type('{backspace}');
		ceHelper.checkPlainContent('Hello WorldGreen red');
		ceHelper.checkSelectionIsNull();
		ceHelper.checkCaretPosition(11);
	});

	it('Typing <delete> with empty selection', function () {
		ceHelper.type('Green red');
		ceHelper.checkPlainContent('Green red');
		ceHelper.select(6, 7);
		ceHelper.moveCaret('left', 'shift');
		ceHelper.checkSelectionIsEmpty(6);
		ceHelper.type('or ');
		ceHelper.checkSelectionIsEmpty(9);
		ceHelper.type('{del}');
		ceHelper.checkPlainContent('Green or ed');
		ceHelper.checkCaretPosition(9);
		ceHelper.checkSelectionIsNull();
		ceHelper.select(7, 6);
		ceHelper.moveCaret('right', 'shift');
		ceHelper.checkSelectionIsEmpty(7);
		ceHelper.type('{del}');
		ceHelper.checkPlainContent('Green o ed');
		ceHelper.checkCaretPosition(7);
		ceHelper.checkSelectionIsNull();
	});

	it('Typing <delete> with empty selection at the end of the paragraph', function () {
		ceHelper.type('Hello World');
		ceHelper.type('{enter}');
		ceHelper.type('Green red');
		ceHelper.moveCaret('up');
		ceHelper.moveCaret('end');
		ceHelper.moveCaret('left', 'shift');
		ceHelper.moveCaret('right', 'shift');
		ceHelper.checkPlainContent('Hello World');
		ceHelper.checkSelectionIsEmpty(11);
		ceHelper.type('{del}');
		ceHelper.checkPlainContent('Hello WorldGreen red');
		ceHelper.checkSelectionIsNull();
		ceHelper.checkCaretPosition(11);
	});
});

describe(['tagdesktop', 'tagnextcloud', 'tagproxy'], 'Editable area - Undo/Redo', function() {
	var testFileName = 'undo_redo.odt';

	beforeEach(function () {
		helper.beforeAll(testFileName, 'writer');
		cy.cGet('div.clipboard').as('clipboard');
	});

	afterEach(function () {
		helper.afterAll(testFileName, this.currentTest.state);
	});

	it('Undo/Redo after typing', function () {
		ceHelper.type('Hello World');
		ceHelper.checkPlainContent('Hello World');
		ceHelper.type('{ctrl+z}');
		ceHelper.checkPlainContent('Hello ');
		ceHelper.checkSelectionIsNull();
		ceHelper.checkCaretPosition(6);
		ceHelper.type('{ctrl+y}');
		ceHelper.checkPlainContent('Hello World');
		ceHelper.checkSelectionRange(6, 11);
		ceHelper.moveCaret('end');
		ceHelper.type('{enter}');
		ceHelper.type('Green red');
		ceHelper.moveCaret('up');
		ceHelper.type('{ctrl+z}');
		ceHelper.checkPlainContent('Green ');
		ceHelper.checkSelectionIsNull();
		ceHelper.checkCaretPosition(6);
		ceHelper.moveCaret('up');
		ceHelper.type('{ctrl+y}');
		ceHelper.checkPlainContent('Green red');
		ceHelper.checkSelectionRange(6, 9);
	});

	it('Undo/Redo after <enter>', function () {
		ceHelper.type('Hello World');
		ceHelper.checkPlainContent('Hello World');
		ceHelper.moveCaret('left', '', 6);
		ceHelper.type('{enter}');
		ceHelper.checkPlainContent(' World');
		ceHelper.type('{ctrl+z}');
		ceHelper.checkPlainContent('Hello World');
		ceHelper.checkSelectionIsNull();
		ceHelper.checkCaretPosition(5);
		ceHelper.type('{ctrl+y}');
		ceHelper.checkPlainContent(' World');
		ceHelper.checkSelectionIsNull();
		ceHelper.checkCaretPosition(0);
	});

	it('Undo/Redo after <backspace>', function () {
		ceHelper.type('Hello World');
		ceHelper.checkPlainContent('Hello World');
		ceHelper.type('{backspace}', 5);
		ceHelper.checkPlainContent('Hello ');
		ceHelper.type('{ctrl+z}');
		ceHelper.checkPlainContent('Hello World');
		ceHelper.checkSelectionRange(6, 11);
		ceHelper.type('{ctrl+y}');
		ceHelper.checkPlainContent('Hello ');
		ceHelper.checkSelectionIsEmpty(6);
	});

	it('Undo/Redo after <delete>', function () {
		ceHelper.type('Hello World');
		ceHelper.checkPlainContent('Hello World');
		ceHelper.moveCaret('left', '', 5);
		ceHelper.type('{del}', 5);
		ceHelper.checkPlainContent('Hello ');
		ceHelper.type('{ctrl+z}');
		ceHelper.checkPlainContent('Hello World');
		ceHelper.checkSelectionRange(6, 11);
		ceHelper.type('{ctrl+y}');
		ceHelper.checkPlainContent('Hello ');
		ceHelper.checkSelectionIsEmpty(6);
	});
});

describe(['tagdesktop', 'tagnextcloud', 'tagproxy'], 'Editable area - More typing', function() {
	var testFileName = 'undo_redo.odt';

	beforeEach(function() {
		helper.beforeAll(testFileName, 'writer');
		cy.cGet('div.clipboard').as('clipboard');
	});

	afterEach(function() {
		helper.afterAll(testFileName, this.currentTest.state);
	});

	it('Typing after undo command', function() {
		ceHelper.type('Hello World');
		ceHelper.checkPlainContent('Hello World');
		ceHelper.type('{ctrl+z}');
		// After undo/redo client makes an explicit request for a new version of current paragraph.
		// So we need to skip to send new input to core until client receives the updated content.
		// So let's do a tiny wait before starting typing.
		// cy.wait(50);
		ceHelper.type('Duck');
		ceHelper.checkPlainContent('Hello Duck');
		ceHelper.checkSelectionIsNull();
		ceHelper.checkCaretPosition(10);
	});

	it('Typing after click', function() {
		ceHelper.type('Hello World');
		ceHelper.moveCaret('left', '', 5);
		helper.getBlinkingCursorPosition('P');
		ceHelper.moveCaret('end');
		ceHelper.type(' again');
		helper.clickAt('P');
		ceHelper.type('red');
		ceHelper.checkPlainContent('Hello redWorld again');
		ceHelper.checkCaretPosition(9);
	});

	it('Typing after <delete>', function() {
		ceHelper.type('Hello World');
		ceHelper.moveCaret('left', '', 5);
		ceHelper.type('{del}', 4);
		ceHelper.type('moo');
		ceHelper.checkPlainContent('Hello mood');
		ceHelper.checkCaretPosition(9);
	});

	it('Typing after <enter> at beginning of the line', function() {
		ceHelper.type('Hello World');
		ceHelper.moveCaret('home');
		ceHelper.type('{enter}', 3);
		ceHelper.type('Green ');
		ceHelper.checkPlainContent('Green Hello World');
		ceHelper.checkCaretPosition(6);
	});

	it('Typing after <backspace> at beginning of the line', function() {
		ceHelper.type('Hello World');
		ceHelper.type('{enter}', 3);
		ceHelper.type('Green and red');
		ceHelper.moveCaret('home');
		ceHelper.type('{backspace}', 3);
		ceHelper.type(' Yellow ');
		ceHelper.checkPlainContent('Hello World Yellow Green and red');
		ceHelper.checkCaretPosition(19);
	});

	// It fails, no copy/paste command is emitted by the client
	it.skip('Copy/Paste', function() {
		ceHelper.type('Hello World');
		ceHelper.type('{enter}');
		ceHelper.type('Green red');
		ceHelper.moveCaret('up');
		ceHelper.select(6, 11);
		ceHelper.type('{ctrl+c}');
		ceHelper.checkPlainContent('Hello World');
		ceHelper.checkSelectionRange(6, 11);
		ceHelper.moveCaret('down');
		ceHelper.moveCaret('end');
		ceHelper.type('{ctrl+v}');
		ceHelper.checkPlainContent('Green redWorld');
	});

});