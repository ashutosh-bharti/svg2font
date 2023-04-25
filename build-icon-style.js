const fs = require('fs');
const css = require('css');

fs.readFile('./styles/mr-icon.css', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    let ast = css.parse(data);
    let newAst = css.parse(data);
    let isCommentSkip = false;
    let fontFamily = '';
    newAst.stylesheet.rules = [];
    for (let ruleIndex = 0; ruleIndex < ast.stylesheet.rules.length; ruleIndex++) {
        const rule = ast.stylesheet.rules[ruleIndex];
        if (rule.type === 'font-face') {
            continue;
        }
        else if (isCommentSkip) {
            isCommentSkip = false;
            continue;
        }
        else if (rule.type === 'comment') {
            // newAst.stylesheet.rules.push(rule);
            continue;
        } else if (rule.type === 'rule') {
            let newRule = rule;
            if (rule.selectors.length) {
                let newSelectors = [];
                let isIcon = false;
                let isClass = false;
                for (const decl of rule.declarations) {
                    if (decl.type === 'declaration' && decl.property === 'content') {
                        isIcon = true;
                        break;
                    }
                }
                for (const selector of rule.selectors) {
                    let newSelector;
                    if (selector.includes('[class')) {
                        newSelector = selector.replace(':before', '');
                        isIcon = false;
                        isClass = true;
                    } else {
                        if (isIcon && selector.includes(':before')) {
                            newSelector = selector.replace(':before', '.icon');
                        } else {
                            newSelector = selector;
                        }
                    }
                    newSelectors.push(newSelector);
                }
                newRule.selectors = newSelectors;
                if (isClass) {
                    let newDeclarations = [];
                    for (const declaration of rule.declarations) {
                        if (declaration.type === 'declaration') {
                            if (declaration.property === 'font-family') {
                                fontFamily = declaration.value;
                                newDeclarations.push(declaration);
                            }
                            if (declaration.property === 'font-style' ||
                                declaration.property === 'font-weight' ||
                                declaration.property === 'speak' ||
                                declaration.property === 'font-variant' ||
                                declaration.property === 'text-transform' ||
                                declaration.property === '-webkit-font-smoothing' ||
                                declaration.property === '-moz-osx-font-smoothing' ||
                                declaration.property === 'text-align') {
                                newDeclarations.push(declaration);
                            }
                        } else if (declaration.type === 'comment') {
                            // newDeclarations.push(declaration);
                            continue;
                        } else {
                            newDeclarations.push(declaration);
                        }
                    }
                    newRule.declarations = newDeclarations;
                }
                if (isIcon) {
                    let newDeclarations = [];
                    for (let declarationIndex = 0; declarationIndex < rule.declarations.length; declarationIndex++) {
                        let declaration = rule.declarations[declarationIndex];
                        if (declaration.type === 'declaration' && declaration.property === 'content') {
                            if (ast.stylesheet.rules[ruleIndex + 1] && ast.stylesheet.rules[ruleIndex + 1].type === 'comment') {
                                isCommentSkip = true;
                                let tempRule = ast.stylesheet.rules[ruleIndex + 1];
                                let glyphChar = tempRule.comment.replace(" '", "").replace("' ", "");
                                let commentText = " " + declaration.value + " ";
                                declaration.value = glyphChar;
                                let newDeclaration = {
                                    type: 'declaration',
                                    property: 'font-family',
                                    value: fontFamily
                                };
                                newDeclarations.push(newDeclaration);
                                let newCommentDelc = {
                                    type: 'comment',
                                    comment: commentText
                                };
                                newDeclarations.push(newCommentDelc);
                            }
                        }
                        newDeclarations.push(declaration);
                    }
                    newRule.declarations = newDeclarations;
                }
            }
            newAst.stylesheet.rules.push(newRule);
        }
        else {
            newAst.stylesheet.rules.push(rule);
        }
    }

    let result = css.stringify(newAst);
    fs.writeFile('./icons-dist/mr-icon.less', result, err => {
        if (err) {
            console.error(err);
            return;
        }
        console.log('File converted and saved successfully.');
    });
});