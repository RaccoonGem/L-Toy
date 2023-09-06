# L-Toy
A program that lets you play with L-systems

L-systems are made up with a "seed" string and any number of character-replacement rules.
For example, passing the string "ac" through a rule like "a -> aba" (input "a", output "aba") would produce "abac". The second iteration would then produce "abababac".
When there are multiple rules, they run in order. Characters appearing in the output of a rule can't be used as inputs until the next iteration begins.
In traditional L-systems, rules with inputs that are multiple characters long are not allowed. This is because they can create conflicts with each other.
However, in L-Toy, I have made various decisions about how these conflicts play out and resolve that hopefully create the most interesting behavior.
Rules running "in order" is one such decision. Placing a rule higher on the list makes it take priority over those below it, meaning it can "steal" characters from them.
Furthermore, the string is read from left to right when executing the rules. I may add an option for reading direction in the future, to allow for even more possible behaviors.

The rules are applied via relatively simple regular expressions. "Iterations" determines how many times the rules will be run on the string.

I plan to add a second editor for turning strings into instructions for drawing a line or some other form of visualization.
This way, well-known fractals like the Koch curve (and entirely new things, too) can be created by/encoded as L-systems.

Also, I will probably remake this as a React app, as I think it'd be a better fit for this kind of program.
As much as I love canvas, I really only used it for L-Toy because it was all I knew at the time.
