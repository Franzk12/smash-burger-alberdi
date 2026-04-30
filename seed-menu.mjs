import { createClient } from '@supabase/supabase-js';


const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const burgers = [
  { name: "Big Smash", price: 9500, description: "Medallón de carne · Pepinillo · Cebolla Brunoise · Lechuga · Queso Cheddar · Salsa Smash", category: "burger" },
  { name: "Americana", price: 9500, description: "Medallón de carne · Bacon · Queso Cheddar · Cebolla Caramelizada · Salsa Smash", category: "burger" },
  { name: "Cheesse Burger", price: 9500, description: "Medallón de carne · Bacon · Queso Cheddar · Cebolla Brunoise · Salsa Smash", category: "burger" },
  { name: "Cuarto de Libra", price: 9000, description: "Medallón de carne · Queso Cheddar · Ketchup · Mostaza · Cebolla Brunoise", category: "burger" },
  { name: "CangreBurger", price: 9500, description: "Medallón de carne · Cebolla · Lechuga · Tomate · Queso Cheddar · Salsa Smash", category: "burger" },
  { name: "Especial", price: 9000, description: "Medallón de carne · Jamón y Queso Tybo · Lechuga · Tomate · Huevo · Mayonesa", category: "burger" },
  { name: "Crispy Onion", price: 9000, description: "Medallón de carne · Queso Cheddar · Cebolla Crispy · Salsa Barbacoa", category: "burger" },
  { name: "OKC Smash", price: 9000, description: "Medallón de carne · Queso Cheddar · Cebolla Salteada en aceite de Bacon", category: "burger" },
  { name: "Golden Onion", price: 10000, description: "Medallón de carne · Aros de Cebolla · Queso Cheddar · Bacon · Mostaza · Ketchup", category: "burger" },
  { name: "Blue", price: 11000, description: "Medallón de carne · Cheddar · Cebolla Caramelizada · Queso Azul con Nuez · Tomates Confitados y Ahumados", category: "burger" },
];

const milanesas = [
  { name: "Milanesa Común", price: 11000, category: "milanesa", description: "" },
  { name: "Milanesa Especial", price: 11500, category: "milanesa", description: "" },
  { name: "Lomito Común", price: 12000, category: "milanesa", description: "" },
  { name: "Lomito Especial", price: 12500, category: "milanesa", description: "" },
];

const papas = [
  { name: "Papas Smash", price: 8500, description: "Queso Cheddar · Bacon · Verdeo", category: "papa" },
  { name: "Salchipapa", price: 7000, description: "Papas · Salchicha · Queso Cheddar · Verdeo", category: "papa" },
  { name: "Papas Gratinadas", price: 7500, description: "", category: "papa" },
  { name: "Porción de Papas", price: 5500, description: "", category: "papa" },
];

const extras = [
  { name: "Pepinillos", price: 600, category: "extra", description: "" },
  { name: "Aros de Cebolla", price: 800, category: "extra", description: "" },
  { name: "Huevo", price: 600, category: "extra", description: "" },
  { name: "Jamón", price: 600, category: "extra", description: "" },
  { name: "Bacon", price: 700, category: "extra", description: "" },
  { name: "Medallón Extra con Queso", price: 2500, category: "extra", description: "" },
  { name: "Baño de Cheddar y Bacon", price: 2000, category: "extra", description: "" },
];

const allProducts = [...burgers, ...milanesas, ...papas, ...extras];

async function seed() {
  console.log('Seeding products to Supabase...');
  const { data, error } = await supabase.from('productos').insert(allProducts);
  if (error) {
    console.error('Error seeding products:', error);
  } else {
    console.log('Successfully seeded products!');
  }
}

seed();
