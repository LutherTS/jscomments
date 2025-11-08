/* TEST START
$COMMENT#HELLO
$COMMENT#GOODBYE
$COMMENT#HELLOALIAS // HELLOALIAS
$COMMENT#COMPOSED
$COMMENT#COMPOSEDWITHALIAS
// Now these should resolve on extension, while these below should not, when variations are specified.

$COMMENT#FORCOMPOSED3 // should/does not resolve as exclusive
$COMMENT#EN#HELLO // should/does not resolve on CLI
$COMMENT#FR#HELLO // should/does not resolve on extension
TEST END */

/** $COMMENT#COMPOSEDWITHALIAS */
const _testFunction = () => {};
// The TypeScript server plugin also needs to be adapted to variations. Done.
