/* TEST START
$COMMENT#HELLO
$COMMENT#GOODBYE
$COMMENT#HELLOALIAS // HELLOALIAS
$COMMENT#COMPOSED
$COMMENT#COMPOSEDWITHALIAS
// Now these should/do resolve on extension, while these below should/do not, when variations are specified.

$COMMENT#FORCOMPOSED3 // should/does not resolve as exclusive
$COMMENT#EN#HELLO // should/does not resolve on CLI
$COMMENT#FR#HELLO // should/does not resolve on extension
TEST END */

/** $COMMENT#_TESTFUNCTION */
const _testFunction = () => {};
// The TypeScript server plugin is now also adapted to variations.
