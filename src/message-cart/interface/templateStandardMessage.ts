interface TemplateTextParameter {
  type: 'text';
  text: string;
}

interface TemplateHeaderImageParameter {
  type: 'image';
  image: {
    link: string;
  };
}

interface TemplateComponent {
  type: 'header' | 'body';
  parameters: TemplateTextParameter[] | TemplateHeaderImageParameter[];
}

interface TemplateMessage {
  messaging_product: 'whatsapp';
  recipient_type: 'individual';
  to: string;
  type: 'template';
  template: {
    name: string;
    language: {
      code: string;
    };
    components: TemplateComponent[];
  };
}
