import type { HtmlHTMLAttributes } from 'vue';

type BiltNodes = BiltNode[];
type BiltNode = BiltNodeVariant | BiltNodeReactive;

type BiltNodeVariant =
  | NodeTextContent
  | [BiltNodeType | ReactiveValue]
  | [BiltNodeType | ReactiveValue, BiltNodeProps | ReactiveValue]
  | [
      BiltNodeType | ReactiveValue,
      BiltNodeProps | ReactiveValue | null,
      BiltNodes
    ];

type NodeTextContent = string | ReactiveValue;

type BiltNodeType = keyof HTMLElementTagNameMap;
type BiltNodeReactive = {
  $: {
    list?: [BiltNode, string] | [BiltNodes, string];
    if?: [BiltNode, string] | [BiltNodes, string];
    else?: BiltNode | BiltNodes;
  };
};
type ReactiveValue = { $: string };

type BiltNodeProps = {
  [K in keyof HtmlHTMLAttributes]?: string | ReactiveValue;
} & {
  [K in keyof HTMLElementEventMap]?: EventValue;
} & { style?: Partial<CSSStyleDeclaration> };
type EventValue =
  | string
  | [string]
  | [string, string[] | null]
  | [string, string[] | null, string[] | null];

type BiltProps = {
  model: any;
  reactiveFn: Function;
  listItems?: {
    __list?: string[];
  } & Partial<{
    [key: string]: {
      item: any;
      index: number;
      modelString: string;
    };
  }>;
};
function isBiltNodeReactive(node: BiltNode): node is BiltNodeReactive {
  return (node as BiltNodeReactive).$ !== undefined;
}

function getNodes(nodes: BiltNodes, biltProps: BiltProps) {
  const render = [];
  if (!biltProps.listItems) {
    biltProps.listItems = {};
    biltProps.listItems.__list = [];
  }
  const nodesEl = biltProps.reactiveFn();
  nodes.forEach((node, nodeIndex) => {
    render.push(getNode(node, biltProps));
  });
}

function getNode(node: BiltNode, biltProps: BiltProps): any {
  if (isBiltNodeReactive(node)) {
    if (typeof node.$ == 'string') {
      return biltProps.model[node.$];
    } else {
      if (node.$.if) {
        // always evaluate if first
        let ifNode;
        let elseNode;
        const [biltNodeIf, modelString] = node.$.if;
        ifNode = Array.isArray(biltNodeIf)
          ? getNodes(biltNodeIf as BiltNodes, biltProps)
          : getNode(biltNodeIf as BiltNode, biltProps);

        if (node.$.else) {
          const biltNodeElse = node.$.else;
          elseNode = Array.isArray(biltNodeElse)
            ? getNodes(biltNodeElse as BiltNodes, biltProps)
            : getNode(biltNodeElse as BiltNode, biltProps);
        }

        return biltProps.model[modelString] ? ifNode : elseNode;
      }
      if (node.$.list) {
        // evaluate list
        const [biltNode, modelString] = node.$.list;
        // todo: need to add parent items into list elements
        return biltProps.model[modelString].map((item: any, index: number) => {
          biltProps.listItems!.__list!.push(modelString);
          biltProps.listItems![modelString] = {
            index,
            item,
            modelString,
          };
          return Array.isArray(biltNode)
            ? getNodes(biltNode as BiltNodes, biltProps)
            : getNode(biltNode as BiltNode, biltProps);
        });
      }
    }
  } else if (Array.isArray(node)) {
    const nodeEl = biltProps.reactiveFn();

    const [component, props, children] = node;
  } else {
    // it's a non-reactive node text content
    return node;
  }
}

function parseReactiveString(str: string, biltProps: BiltProps) {
  let arr = str.split('.');
  let model = biltProps.model;
  if (arr[0].startsWith('__bilt')) {
    model = biltProps[arr[0].substring(6) as keyof BiltProps];
    arr.length > 1 ? arr.shift() : (arr = []);
  }
  return arr.reduce((acc, curr) => acc[curr], model);
}

// function getNodeProps(
//   node: BiltNode,
//   nodeIndex: number,
//   nodeEl,
//   nodesEl,
//   props: BiltNodeProps
// ) {
//   let nodeProps: any = {};
//   for (const [propName, propValue] of Object.entries(props)) {
//     nodeProps[propName] = handleProps(propName, propValue, {
//       node,
//       nodeIndex,
//       nodeEl,
//       siblingsEl: nodesEl.value,
//     });
//   }
//   return nodeProps;
// }

// function createNode(node: Exclude<BiltNodeVariant, NodeTextContent>) {
//   const [component, props, children] = node;
// }

// function handleProps(propName: string, propValue: any, eventProps: any) {
//   if (propName.startsWith('on')) {
//     if (Array.isArray(propValue)) {
//       const [fn, params, modifiers] = propValue;
//       return modifiers
//         ? withModifiers((event) => {
//             getNodeEvent(fn, event, { params, ...eventProps });
//           }, modifiers)
//         : function (event: Event) {
//             // console.log(event)
//             getNodeEvent(fn, event, { params, ...eventProps });
//           };
//     } else {
//       return function (event: Event) {
//         getNodeEvent(propValue, event, eventProps);
//       };
//     }
//   } else if (propValue.$) {
//     return model.value[propValue.$];
//   } else {
//     if (propName === 'style' || propName === 'class') {
//       return Object.entries(propValue).reduce((acc, [key, value]) => {
//         acc[key] = value.$ ? model.value[value.$] : value;
//         return acc;
//       }, {});
//     } else {
//       return propValue;
//     }
//   }
// }

// function getNodeEvent(fn, event, eventProps) {
//   return model.value[fn]({ event, ...eventProps });
// }
