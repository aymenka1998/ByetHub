// Import types from the central types file
import type { Category, Product, StrapiDataItem } from './types';

export const mockCategories: StrapiDataItem<Category>[] = [
  {
    id: 1,
    attributes: {
      name: "حواسيب ألعاب (Gaming PCs)",
      slug: "gaming-pcs",
      image: {
        data: {
          id: 1,
          attributes: {
            url: "/images/categories/gaming-pcs.png",
            alternativeText: "Gaming PCs Category"
          }
        }
      }
    }
  },
  {
    id: 2,
    attributes: {
      name: "حواسيب محمولة (Laptops)",
      slug: "laptops",
      image: {
        data: {
          id: 2,
          attributes: {
            url: "/images/categories/laptops.png",
            alternativeText: "Laptops Category"
          }
        }
      }
    }
  },
  {
    id: 3,
    attributes: {
      name: "شاشات (Monitors)",
      slug: "monitors",
      image: {
        data: {
          id: 3,
          attributes: {
            url: "/images/categories/monitors.png",
            alternativeText: "Monitors Category"
          }
        }
      }
    }
  },
  {
    id: 4,
    attributes: {
      name: "إكسسوارات (Accessories)",
      slug: "accessories",
      image: {
        data: {
          id: 4,
          attributes: {
            url: "/images/categories/accessories.png",
            alternativeText: "Accessories Category"
          }
        }
      }
    }
  }
];

export const mockProducts: StrapiDataItem<Product>[] = [
  {
    id: 1,
    attributes: {
      name: "حاسوب الألعاب الخارق Antigravity RTX 4090 Monster",
      slug: "antigravity-rtx-4090-monster",
      price: 12499,
      originalPrice: 13999, // Changed from oldPrice
      description: [
        {
          type: "paragraph",
          children: [
            {
              type: "text",
              text: "استمتع بأقوى أداء للألعاب مع حاسوب الألعاب الخارق. مجهز بمعالج Intel Core i9 من الجيل الرابع عشر، وبطاقة الرسوميات العملاقة NVIDIA RTX 4090 بسعة 24 جيجابايت، وذاكرة عشوائية DDR5 بسعة 64 جيجابايت، مع وحدة تخزين فائقة السرعة NVMe SSD بسعة 2 تيرابايت. نظام تبريد مائي مغلق بالكامل وإضاءة RGB مذهلة قابلة للتخصيص وهيكل أنيق بجوانب زجاجية.",
            },
          ],
        },
      ],
      isFeatured: true, // Changed from featured
      quantite: 5, // Changed from stock — fixed to match Strapi
      category: {
        data: {
          id: 1,
          attributes: {
            name: "حواسيب ألعاب (Gaming PCs)",
            slug: "gaming-pcs"
          }
        }
      },
      images: {
        data: [
          {
            id: 101,
            attributes: {
              url: "/images/gaming-pc.png",
              alternativeText: "حاسوب ألعاب خارق"
            }
          }
        ]
      }
    }
  },
  {
    id: 2,
    attributes: {
      name: "حاسوب محمول للألعاب وصناع المحتوى Antigravity Pro Aero 16",
      slug: "antigravity-pro-aero-16",
      price: 7899,
      originalPrice: 8499, // Changed from oldPrice
      description: [
        {
          type: "paragraph",
          children: [
            {
              type: "text",
              text: "حاسوب محمول رائد يجمع بين قوة أجهزة الألعاب وخفة وزن أجهزة صناع المحتوى. مجهز بشاشة OLED بحجم 16 بوصة وبدقة 4K ومعدل تحديث 120 هرتز. يعمل بمعالج AMD Ryzen 9 وكرت شاشة NVIDIA RTX 4070، مع 32 جيجابايت من الرام وهارد SSD بسعة 1 تيرابايت. لوحة مفاتيح مضيئة وهيكل معدني متين وخفيف الوزن.",
            },
          ],
        },
      ],
      isFeatured: true, // Changed from featured
      quantite: 8, // Changed from stock — fixed to match Strapi
      category: {
        data: {
          id: 2,
          attributes: {
            name: "حواسيب محمولة (Laptops)",
            slug: "laptops"
          }
        }
      },
      images: {
        data: [
          {
            id: 102,
            attributes: {
              url: "/images/laptop.png",
              alternativeText: "لابتوب ألعاب وصناعة محتوى"
            }
          }
        ]
      }
    }
  },
  {
    id: 3,
    attributes: {
      name: "شاشة ألعاب منحنية فائقة العرض Antigravity Curved Ultrawide 34",
      slug: "antigravity-curved-ultrawide-34",
      price: 2499,
      originalPrice: 2999, // Changed from oldPrice
      description: [
        {
          type: "paragraph",
          children: [
            {
              type: "text",
              text: "شاشة ألعاب منحنية بحجم 34 بوصة فائقة الاتساع (Ultrawide 21:9) بدقة WQHD ومعدل تحديث 165 هرتز وزمن استجابة 1 ملي ثانية. تدعم تقنية HDR 400 وتقنية FreeSync Premium لتجربة ألعاب غامرة بدون أي تقطيع. تصميم مميز بحواف نحيفة للغاية وإضاءة خلفية محيطية خافتة.",
            },
          ],
        },
      ],
      isFeatured: true, // Changed from featured
      quantite: 12, // Changed from stock — fixed to match Strapi
      category: {
        data: {
          id: 3,
          attributes: {
            name: "شاشات (Monitors)",
            slug: "monitors"
          }
        }
      },
      images: {
        data: [
          {
            id: 103,
            attributes: {
              url: "/images/monitor.png",
              alternativeText: "شاشة ألعاب منحنية"
            }
          }
        ]
      }
    }
  },
  {
    id: 4,
    attributes: {
      name: "لوحة مفاتيح ميكانيكية مضيئة Antigravity Neon Cyber Keyboard",
      slug: "antigravity-neon-cyber-keyboard",
      price: 450,
      originalPrice: 550, // Changed from oldPrice
      description: [
        {
          type: "paragraph",
          children: [
            {
              type: "text",
              text: "لوحة مفاتيح ميكانيكية مخصصة للاعبين المحترفين بتنسيق 75٪. تحتوي على مفاتيح زرقاء ميكانيكية سريعة الاستجابة مع إضاءة RGB خلفية قابلة للبرمجة بالكامل وتأثيرات ضوئية متعددة. هيكل مصنوع من الألمنيوم المتين وكابل USB-C مغطى بالقماش وقابل للفصل.",
            },
          ],
        },
      ],
      isFeatured: false, // Changed from featured
      quantite: 25, // Changed from stock — fixed to match Strapi
      category: {
        data: {
          id: 4,
          attributes: {
            name: "إكسسوارات (Accessories)",
            slug: "accessories"
          }
        }
      },
      images: {
        data: [
          {
            id: 104,
            attributes: {
              url: "/images/keyboard.png",
              alternativeText: "لوحة مفاتيح ميكانيكية"
            }
          }
        ]
      }
    }
  },
  {
    id: 5,
    attributes: {
      name: "فأرة ألعاب لاسلكية فائقة الدقة Antigravity Swift RGB Mouse",
      slug: "antigravity-swift-rgb-mouse",
      price: 299,
      originalPrice: 349, // Changed from oldPrice
      description: [
        {
          type: "paragraph",
          children: [
            {
              type: "text",
              text: "فأرة ألعاب لاسلكية فائقة الخفة بوزن 60 جرام فقط. مستشعر بصري متطور بدقة تصل إلى 26,000 DPI وسرعة تتبع فائقة. اتصال لاسلكي خالي من التأخير بتردد 2.4 جيجاهرتز وبطارية تدوم حتى 80 ساعة عمل متواصلة مع إضاءة RGB أنيقة قابلة للتعديل.",
            },
          ],
        },
      ],
      isFeatured: true, // Changed from featured
      quantite: 30, // Changed from stock — fixed to match Strapi
      category: {
        data: {
          id: 4,
          attributes: {
            name: "إكسسوارات (Accessories)",
            slug: "accessories"
          }
        }
      },
      images: {
        data: [
          {
            id: 105,
            attributes: {
              url: "/images/mouse.png",
              alternativeText: "فأرة ألعاب لاسلكية"
            }
          }
        ]
      }
    }
  }
];
