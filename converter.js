/**
 * Created by Romitou on 3/8/20.
 * Work in progress.
 */

async function parse() {
    const code = document.getElementById('input').value.split('\n');
    const softIndent = document.getElementById('tabulations').checked ? '\t' : '    ';

    let player;
    let output = [];
    let indentation = '';
    let guiSection = false;

    code.push(''); // Ajout d'une ligne vide
    for (let line of code) {
        if (!(line.startsWith(' ') || line.startsWith('\t')) && guiSection) {
            output.push(indentation + 'open last created gui to ' + player[0]);
            guiSection = false;
        } else if (/open virtual/gim.test(line)) {
            player = /(player|executor|victim|attacker|{.*?})/gim.exec(line);
            line = line.replace(/ (of|to) (player|executor|victim|attacker|{.*?})/gim, '');
            line = line.replace(/open virtual/gim, 'create a gui with virtual') + ':';
            line = line.replace(/virtual .+/gim, 'virtual ' + line.match(/virtual .+/gim)[0].split(' ')[1] + ' inventory');
            indentation = line.match(/\s+/g)[0];
            guiSection = true;
        } else if (/(make|format|create)( a)? gui slot/gim.test(line)) {
            line = line.replace(/ (of|to) (player|executor|victim|attacker|{.*?})/gim, '');
            line = line.replace(/to (do)? nothing/gim, '');
            line = line.replace(/(make|format|create)( a)? gui slot/gim, 'make gui slot');
            line = line.replace(/ (to )?(run|exec|execute)( function)? /gim, ':\n' + indentation + softIndent.repeat(2));
            line = line.replace(/ to close( then)?(:)?/gim, ':\n' + indentation + softIndent.repeat(2) + 'close ' + player[0] + '\'s inventory');
            line = line.replace(/(player|executor|victim|attacker|console|{.*?}) command/, 'make ' + line.match(/(player|executor|victim|attacker|console|{.*?})/gim) + ' execute command');
            line = softIndent + line;
        } else if (guiSection) {
            line = softIndent + line;
        }
        output.push(line);
    }
    return output.join('\n');
}

async function convert() {
    const error = document.getElementById('error');
    const success = document.getElementById('success');
    error.hidden = true;
    success.hidden = true;
    try {
        document.getElementById('output').value = await parse();
        success.hidden = false;
    } catch (err) {
        console.error(err);
        error.hidden = false;
    }
}
