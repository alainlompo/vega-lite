import {isFieldDef} from '../../fielddef';
import {Config} from '../../config';
import {isInternalData} from '../../data';
import {FieldDef} from '../../fielddef';
import {SIZE, ANCHOR, OFFSET} from '../../channel';
import {VgValueRef, VgEncodeEntry} from '../../vega.schema';

import {applyConfig} from '../common';
import {UnitModel} from '../unit';

import {applyColorAndOpacity} from './common';
import {MarkCompiler} from './base';
import {textRef} from './text';
import * as ref from './valueref';

export const label: MarkCompiler = {
  vgMark: 'text',
  role: undefined,

  encodeEntry: (model: UnitModel) => {
    const data = model.data();

    if (isInternalData(data)) {
      let e: VgEncodeEntry = {};

      const config = model.config();

      applyConfig(e, model.config().label,
        ['angle', 'align', 'baseline', 'dx', 'dy', 'font', 'fontWeight',
          'fontStyle', 'radius', 'theta', 'text']);

      const textDef = model.encoding().text;

      e.fontSize = ref.midPoint(SIZE, model.encoding().size, model.scaleName(SIZE), model.scale(SIZE),
        {value: config.label.fontSize}
      );

      // TODO: check if its internalData
      const referenceMark = model.parent().children().filter((sibling) => sibling.name() === data.ref)[0];
      e.text = textRef(textDef, config);

      /* Labeling properties */
      e.anchor = anchor(model.encoding().anchor, model.scaleName(ANCHOR), config);
      e.offset = offset(model.encoding().offset, model.scaleName(OFFSET), config);

      applyColorAndOpacity(e, model);

      return e;
    } else {
      throw new Error('Label requires internal data');
    }
  }
};


function anchor(fieldDef: FieldDef, scaleName: string, config: Config): VgValueRef {
  if (isFieldDef(fieldDef)) {
    return ref.fieldRef(fieldDef, scaleName, {datum: true});
  }

  // const orient = config.mark.orient;

  // return sensible default given orient, model
  return 'top';
}

function offset(fieldDef: FieldDef, scaleName: string, config: Config): VgValueRef {
  if (isFieldDef(fieldDef)) {
    return ref.fieldRef(fieldDef, scaleName, {datum: true});
  }

  // const orient = config.mark.orient;

  // return sensible default given orient, model
  return 1;
}
