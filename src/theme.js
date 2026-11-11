import * as Blockly from 'blockly';
// Palette sampled from the user's open Tinkercad Codeblocks editor.
export const palette={canvas:'#394556',flyout:'#46556a',blue:'#4585e5',purple:'#9569e5',orange:'#f89e4d',green:'#45c043',cyan:'#3fb1d8'};
const block=(colourPrimary,colourSecondary,colourTertiary)=>({colourPrimary,colourSecondary,colourTertiary});
export const studioTheme=Blockly.Theme.defineTheme('studio-codeblocks',{
 base:Blockly.Themes.Classic,
 blockStyles:{
 text_blocks:block(palette.cyan,'#3498bc','#2e829f'),
 logic_blocks:block(palette.blue,'#3873cd','#3063b3'),
 loop_blocks:block(palette.orange,'#df8328','#bd6d20'),
 math_blocks:block(palette.green,'#389438','#2e7c2e'),
 list_blocks:block(palette.purple,'#8055ce','#6c47b1'),
 variable_blocks:block(palette.cyan,'#3498bc','#2e829f'),
 variable_dynamic_blocks:block(palette.cyan,'#3498bc','#2e829f'),
 procedure_blocks:block(palette.purple,'#8055ce','#6c47b1')
 },
 componentStyles:{workspaceBackgroundColour:palette.canvas,toolboxBackgroundColour:'#f5f7fa',toolboxForegroundColour:'#40516a',flyoutBackgroundColour:palette.flyout,flyoutForegroundColour:'#ffffff',flyoutOpacity:1,scrollbarColour:'#acb4bf',scrollbarOpacity:.7,insertionMarkerColour:'#ffffff',insertionMarkerOpacity:.3,cursorColour:palette.blue},
 fontStyle:{family:'"Microsoft YaHei", sans-serif',weight:'normal',size:12}
});
