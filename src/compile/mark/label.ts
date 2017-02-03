import {ChannelDef, field, isFieldDef} from '../../fielddef';
import {Config} from '../../config';
import {FieldDef} from '../../fielddef';
import {QUANTITATIVE, TEMPORAL} from '../../type';
import {Scale} from '../../scale';
import {VgValueRef, VgEncodeEntry} from '../../vega.schema';
import {X, Y, COLOR, TEXT, SIZE, ANCHOR, OFFSET} from '../../channel';

import {applyConfig, numberFormat, timeFormatExpression} from '../common';
import {UnitModel} from '../unit';

import {applyColorAndOpacity} from './common';
import {MarkCompiler} from './base';
import {textRef} from './text';
import * as ref from './valueref';

export const label: MarkCompiler = {
  vgMark: 'text',
  role: undefined,

  encodeEntry: (model: UnitModel) => {
    let e: VgEncodeEntry = {};

    applyConfig(e, model.config().text,
      ['angle', 'align', 'baseline', 'dx', 'dy', 'font', 'fontWeight',
        'fontStyle', 'radius', 'theta', 'text']);

    const config = model.config();
    const textDef = model.encoding().text;

    e.fontSize = ref.midPoint(SIZE, model.encoding().size, model.scaleName(SIZE), model.scale(SIZE),
      { value: config.text.fontSize }
    );

    e.text = textRef(textDef, config);

    /* Labeling properties */
    e.anchor = anchor(model.encoding().anchor, model.scaleName(ANCHOR), config);
    e.offset = offset(model.encoding().offset, model.scaleName(OFFSET), config);

    return e;
  }
};


function anchor(fieldDef: FieldDef, scaleName: string, config: Config): VgValueRef {
  if (isFieldDef(fieldDef)) {
    return ref.fieldRef(fieldDef, scaleName, { datum: true });
  }
  
  const orient = config.mark.orient;

  // return sensible default given orient, model
  return 'top'
}

function offset(fieldDef: FieldDef, scaleName: string, config: Config): VgValueRef {
  if (isFieldDef(fieldDef)) {
    return ref.fieldRef(fieldDef, scaleName, { datum: true });
  }
  
  const orient = config.mark.orient;
  
  // return sensible default given orient, model
  return 1
}
