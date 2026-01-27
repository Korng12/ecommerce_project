"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "reviews",
      [
        // iPhone 16 ProMax
        {
          userId: 2, // user
          productId: 1,
          rating: 5.0,
          comment:
            "Excellent phone! The camera quality is outstanding and the performance is top-notch. Worth every penny.",
          createdAt: new Date("2026-01-15"),
          updatedAt: new Date("2026-01-15"),
        },
        {
          userId: 3, // john
          productId: 1,
          rating: 4.5,
          comment:
            "Great device overall. Battery life could be better, but the features are amazing.",
          createdAt: new Date("2026-01-16"),
          updatedAt: new Date("2026-01-16"),
        },

        // Samsung Galaxy S25 Ultra
        {
          userId: 4, // kakda
          productId: 2,
          rating: 4.8,
          comment:
            "Fantastic Android flagship. The S-Pen is a game changer and the display is absolutely gorgeous.",
          createdAt: new Date("2026-01-14"),
          updatedAt: new Date("2026-01-14"),
        },
        {
          userId: 2, // user
          productId: 2,
          rating: 5.0,
          comment:
            "Best phone I've ever owned! Fast, beautiful, and feature-packed.",
          createdAt: new Date("2026-01-17"),
          updatedAt: new Date("2026-01-17"),
        },

        // Asus ROG Flow Z13
        {
          userId: 3, // john
          productId: 3,
          rating: 4.7,
          comment:
            "Innovative gaming laptop with excellent portability. The detachable screen is perfect for different use cases.",
          createdAt: new Date("2026-01-13"),
          updatedAt: new Date("2026-01-13"),
        },
        {
          userId: 4, // kakda
          productId: 3,
          rating: 4.5,
          comment:
            "Powerful gaming laptop in a compact form. Gets a bit hot during intensive gaming sessions.",
          createdAt: new Date("2026-01-18"),
          updatedAt: new Date("2026-01-18"),
        },

        // Asus VivoBook S16 OLED
        {
          userId: 2, // user
          productId: 4,
          rating: 4.5,
          comment:
            "Beautiful OLED display! Perfect for content creation and multimedia. Light and portable too.",
          createdAt: new Date("2026-01-12"),
          updatedAt: new Date("2026-01-12"),
        },
        {
          userId: 3, // john
          productId: 4,
          rating: 4.3,
          comment:
            "Good laptop for everyday use. The OLED screen is stunning but battery drains faster than expected.",
          createdAt: new Date("2026-01-19"),
          updatedAt: new Date("2026-01-19"),
        },

        // MSI Cyborg 15
        {
          userId: 4, // kakda
          productId: 5,
          rating: 4.6,
          comment:
            "Solid gaming laptop for the price. Runs all my games smoothly with high settings.",
          createdAt: new Date("2026-01-11"),
          updatedAt: new Date("2026-01-11"),
        },
        {
          userId: 2, // user
          productId: 5,
          rating: 4.7,
          comment:
            "Great value gaming laptop! The cooling system works well and the keyboard is comfortable.",
          createdAt: new Date("2026-01-20"),
          updatedAt: new Date("2026-01-20"),
        },

        // Apple MacBook Pro 16
        {
          userId: 3, // john
          productId: 6,
          rating: 5.0,
          comment:
            "The best laptop for professional work. M3 chip is incredibly fast and the battery lasts all day.",
          createdAt: new Date("2026-01-10"),
          updatedAt: new Date("2026-01-10"),
        },
        {
          userId: 4, // kakda
          productId: 6,
          rating: 4.9,
          comment:
            "Absolutely love this MacBook! Perfect for video editing and coding. The display is gorgeous.",
          createdAt: new Date("2026-01-21"),
          updatedAt: new Date("2026-01-21"),
        },

        // Asus ROG Azoth keyboard
        {
          userId: 2, // user
          productId: 7,
          rating: 4.8,
          comment:
            "Premium mechanical keyboard with excellent build quality. The wireless connection is flawless.",
          createdAt: new Date("2026-01-09"),
          updatedAt: new Date("2026-01-09"),
        },
        {
          userId: 3, // john
          productId: 7,
          rating: 4.6,
          comment:
            "Great typing experience! A bit pricey but worth it for the quality and features.",
          createdAt: new Date("2026-01-22"),
          updatedAt: new Date("2026-01-22"),
        },

        // MSI MAG Z890
        {
          userId: 4, // kakda
          productId: 8,
          rating: 4.7,
          comment:
            "Excellent motherboard with all the features I need. Easy to install and BIOS is user-friendly.",
          createdAt: new Date("2026-01-08"),
          updatedAt: new Date("2026-01-08"),
        },
        {
          userId: 2, // user
          productId: 8,
          rating: 4.5,
          comment:
            "Solid motherboard for gaming builds. Good connectivity options and stable performance.",
          createdAt: new Date("2026-01-23"),
          updatedAt: new Date("2026-01-23"),
        },

        // Asus ROG STRIX B760-A
        {
          userId: 3, // john
          productId: 9,
          rating: 4.8,
          comment:
            "Top-tier gaming motherboard! DDR5 support and WiFi 6E make it future-proof.",
          createdAt: new Date("2026-01-07"),
          updatedAt: new Date("2026-01-07"),
        },
        {
          userId: 4, // kakda
          productId: 9,
          rating: 4.7,
          comment:
            "Great motherboard with excellent overclocking potential. RGB lighting is customizable.",
          createdAt: new Date("2026-01-24"),
          updatedAt: new Date("2026-01-24"),
        },

        // RTX 5080
        {
          userId: 2, // user
          productId: 10,
          rating: 5.0,
          comment:
            "Beast of a graphics card! Handles 4K gaming at max settings effortlessly. Cooling is superb.",
          createdAt: new Date("2026-01-06"),
          updatedAt: new Date("2026-01-06"),
        },
        {
          userId: 3, // john
          productId: 10,
          rating: 4.9,
          comment:
            "Incredible performance for gaming and rendering. Ray tracing looks amazing!",
          createdAt: new Date("2026-01-25"),
          updatedAt: new Date("2026-01-25"),
        },

        // RTX 4070 Ti
        {
          userId: 4, // kakda
          productId: 11,
          rating: 4.7,
          comment:
            "Excellent mid-range card for 1440p gaming. Great value for performance.",
          createdAt: new Date("2026-01-05"),
          updatedAt: new Date("2026-01-05"),
        },
        {
          userId: 2, // user
          productId: 11,
          rating: 4.8,
          comment:
            "Perfect GPU for high refresh rate gaming. Runs cool and quiet.",
          createdAt: new Date("2026-01-26"),
          updatedAt: new Date("2026-01-26"),
        },

        // RTX 5090
        {
          userId: 3, // john
          productId: 12,
          rating: 5.0,
          comment:
            "The ultimate graphics card! Unmatched performance for 8K gaming and professional workloads.",
          createdAt: new Date("2026-01-04"),
          updatedAt: new Date("2026-01-04"),
        },
        {
          userId: 4, // kakda
          productId: 12,
          rating: 5.0,
          comment:
            "Worth every penny! This card is a powerhouse. Future-proof for years to come.",
          createdAt: new Date("2026-01-27"),
          updatedAt: new Date("2026-01-27"),
        },

        // Samsung 990 Evo
        {
          userId: 2, // user
          productId: 13,
          rating: 4.9,
          comment:
            "Lightning-fast SSD! Boot times are incredible and file transfers are instant.",
          createdAt: new Date("2026-01-03"),
          updatedAt: new Date("2026-01-03"),
        },
        {
          userId: 3, // john
          productId: 13,
          rating: 4.8,
          comment:
            "Excellent NVMe drive with impressive read/write speeds. Great for gaming and content creation.",
          createdAt: new Date("2026-01-26"),
          updatedAt: new Date("2026-01-26"),
        },

        // Asus ROG Strix monitor
        {
          userId: 4, // kakda
          productId: 14,
          rating: 4.7,
          comment:
            "Fantastic gaming monitor with smooth 170Hz refresh rate. Colors are vibrant and accurate.",
          createdAt: new Date("2026-01-02"),
          updatedAt: new Date("2026-01-02"),
        },
        {
          userId: 2, // user
          productId: 14,
          rating: 4.6,
          comment:
            "Great monitor for competitive gaming. Response time is excellent and no ghosting.",
          createdAt: new Date("2026-01-25"),
          updatedAt: new Date("2026-01-25"),
        },

        // MSI MAG 32CQ4
        {
          userId: 3, // john
          productId: 15,
          rating: 4.8,
          comment:
            "Immersive curved display perfect for gaming and movies. 32 inches is the sweet spot!",
          createdAt: new Date("2026-01-01"),
          updatedAt: new Date("2026-01-01"),
        },
        {
          userId: 4, // kakda
          productId: 15,
          rating: 4.7,
          comment:
            "Love the curve! Makes gaming feel more engaging. Great colors and contrast.",
          createdAt: new Date("2026-01-24"),
          updatedAt: new Date("2026-01-24"),
        },

        // Apple Magic Keyboard
        {
          userId: 2, // user
          productId: 16,
          rating: 4.5,
          comment:
            "Clean design and great typing experience. Pairs seamlessly with Mac. Battery lasts forever.",
          createdAt: new Date("2025-12-31"),
          updatedAt: new Date("2025-12-31"),
        },
        {
          userId: 3, // john
          productId: 16,
          rating: 4.4,
          comment:
            "Nice keyboard with Apple quality. Numeric keypad is useful for productivity work.",
          createdAt: new Date("2026-01-23"),
          updatedAt: new Date("2026-01-23"),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("reviews", null, {});
  },
};
