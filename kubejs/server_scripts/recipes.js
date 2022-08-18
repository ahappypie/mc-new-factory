// priority: 0

settings.logAddedRecipes = true
settings.logRemovedRecipes = true
settings.logSkippedRecipes = false
settings.logErroringRecipes = true

const stackChance = {
  1: 0.015625,
  2: 0.03125,
  4: 0.0625,
  8: 0.125,
  16: 0.25,
  32: 0.5,
  64: 1
}

const metals = {
    //from rock
    iron: {nugget: {id: 'minecraft:iron_nugget', washingReturn: 1, washingChance: stackChance[8]}},
    copper: {nugget: {id: 'create:copper_nugget', washingReturn: 1, washingChance: stackChance[8]}},
    zinc: {nugget: {id: 'create:zinc_nugget', washingReturn: 1, washingChance: stackChance[8]}},
    aluminium: {nugget: {id: 'immersiveengineering:nugget_aluminum', washingReturn: 1, washingChance: stackChance[2]}},
    lead: {nugget: {id: 'thermal:lead_nugget', washingReturn: 1, washingChance: stackChance[1]}},
    nickel: {nugget: {id: 'thermal:nickel_nugget', washingReturn: 1, washingChance: stackChance[1]}},
    osmium: {nugget: {id: 'mekanism:nugget_osmium', washingReturn: 1, washingChance: stackChance[1]}},
    tin: {nugget: {id: 'thermal:tin_nugget', washingReturn: 1, washingChance: stackChance[4]}},
    //from sand
    gold: {nugget: {id: 'minecraft:gold_nugget', washingReturn: 3, washingChance: stackChance[8]}},
    silver: {nugget: {id: 'thermal:silver_nugget', washingReturn: 2, washingChance: stackChance[8]}}
}

const washing = [
  {replace: 'create:splashing/gravel', input: '#forge:gravel', outputs: [metals.iron, metals.copper, metals.zinc, metals.aluminium, metals.lead, metals.nickel, metals.osmium, metals.tin], junk: 'minecraft:flint', junkChance: stackChance[16]},
  {replace: 'create:splashing/red_sand', input: '#forge:sand', outputs: [metals.gold, metals.silver], junk: 'minecraft:dead_bush', junkChance: 0.05}
]

function unify(event) {
  // TODO: unify all cross-mod types
}

function renewable_ores(event) {
  washing.forEach((r, i) => {
    if(r.replace) {
      event.remove({id: r.replace})
    }

    const outputs = r.outputs.map((o, j) => {
      return Item.of(o.nugget.id, o.nugget.washingReturn).withChance(o.nugget.washingChance)
    })
    outputs.push(Item.of(r.junk).withChance(r.junkChance))

    event.recipes.createSplashing(outputs, Item.of(r.input))
  })
}

function nucleo(inputItem, gasAmount, outputItem, outputAmount, ticks) {
  var ticksRequired = ticks || 600
  return {
    "type": "mekanism:nucleosynthesizing",
    "id": inputItem + '_to_' + outputItem,
    "itemInput": {
      "ingredient": {
        "item": inputItem
      }
    },
    "gasInput": {
      "amount": gasAmount,
      "gas": "mekanism:antimatter"
    },
    "output": {
      "item": outputItem,
      "count": outputAmount
    },
    "duration": ticksRequired
  }
}

function ender_pearl(event) {
  event.custom(nucleo('mekanism:dust_refined_obsidian', 1, 'thermal:ender_pearl_dust', 1))
  event.remove({id: 'thermal:machines/crucible/crucible_ender_pearl'})
  event.remove({id: 'thermal:machines/chiller/chiller_ender_to_ender_pearl'})
  event.remove({id: 'thermal:machines/pulverizer/pulverizer_ender_pearl'})
  event.recipes.thermal.pulverizer(Item.of('thermal:ender_pearl_dust', 2), 'minecraft:ender_pearl')
  event.recipes.createMilling(Item.of('thermal:ender_pearl_dust', 2), 'minecraft:ender_pearl')
  event.recipes.createCrushing(Item.of('thermal:ender_pearl_dust', 2), 'minecraft:ender_pearl')
  event.recipes.thermal.crucible(Fluid.of('thermal:ender', 1000), 'minecraft:ender_pearl')
  event.recipes.thermal.crucible(Fluid.of('thermal:ender', 250), 'thermal:ender_pearl_dust')
  event.recipes.thermal.chiller('minecraft:ender_pearl', [Fluid.of('thermal:ender', 1000), 'thermal:chiller_ball_cast'])
}

function teleportation_core(event) {
  event.remove({output: 'mekanism:teleportation_core'})
  event.shaped(Item.of('mekanism:teleportation_core', 1), [
    'LAL',
    'GEG',
    'LAL'
  ], {
    L: 'minecraft:lapis_lazuli',
    A: 'mekanism:alloy_atomic',
    G: 'minecraft:gold_ingot',
    E: 'minecraft:ender_pearl'
  })
}

//sync with launch.js
const saws = [
  {name: 'Stone', material: '#forge:stone', uses: 64},
  {name: 'Iron', material: '#forge:ingots/iron', uses: 512},
  {name: 'Diamond', material: '#forge:gems/diamond', uses: 4096}
]

function tier1(event) {
  saws.forEach((saw) => {
    let id = saw.name.toLowerCase()
    event.shaped('kubejs:' + id + '_saw', [
      'SSS',
      ' II',
      ' MM'
    ], {
      S: '#forge:rods',
      I: '#forge:ingots/iron',
      M: saw.material
    })
  })


  let transitional = 'kubejs:incomplete_kinetic_mechanism'
	event.recipes.createSequencedAssembly([
		'kubejs:kinetic_mechanism',
	], '#minecraft:wooden_slabs', [
		event.recipes.createDeploying(transitional, [transitional, 'create:andesite_alloy']),
		event.recipes.createDeploying(transitional, [transitional, 'create:andesite_alloy']),
		event.recipes.createDeploying(transitional, [transitional, '#forge:saws'])
	]).transitionalItem(transitional)
		.loops(1)
		.id('kubejs:kinetic_mechanism')

  event.shapeless('kubejs:kinetic_mechanism', ['#forge:saws', 'create:cogwheel', 'create:andesite_alloy', '#minecraft:logs'])
    .damageIngredient(0)
    .id('kubejs:kinetic_mechanism_manual_only')

	event.shaped('kubejs:andesite_machine', [
		' S ',
		'SCS',
		' S '
	], {
		C: 'create:andesite_casing',
		S: 'kubejs:kinetic_mechanism'
	}).id('kubejs:andesite_machine')

  event.remove({ output: 'thermal:drill_head' })
	event.shaped('thermal:drill_head', [
		'NNN',
		'NII',
		'NIP'
	], {
		N: '#forge:nuggets/iron',
		P: '#forge:plates/iron',
		I: '#forge:ingots/iron'
	})

	event.remove({ output: 'thermal:saw_blade' })
	event.shaped('thermal:saw_blade', [
		'NPN',
		'PIP',
		'NPN'
	], {
    N: '#forge:nuggets/iron',
		P: '#forge:plates/iron',
		I: '#forge:ingots/iron'
	})

  let machine = (id, amount, other_ingredient) => {
		event.remove({ output: id })
		if (other_ingredient) {
			event.smithing(Item.of(id, amount), 'kubejs:andesite_machine', other_ingredient)
			event.recipes.createMechanicalCrafting(Item.of(id, amount), "AB", { A: 'kubejs:andesite_machine', B: other_ingredient })
		}
		else
			event.stonecutting(Item.of(id, amount), 'kubejs:andesite_machine')
	}

  machine('create:portable_storage_interface', 2)
	machine('create:encased_fan', 1, 'create:propeller')
	machine('create:mechanical_press', 1, '#forge:storage_blocks/iron')
	machine('create:mechanical_mixer', 1, 'create:whisk')
	machine('create:mechanical_drill', 1, 'thermal:drill_head')
	machine('create:mechanical_saw', 1, 'thermal:saw_blade')
	machine('create:deployer', 1, 'create:brass_hand')
	machine('create:mechanical_harvester', 2)
	machine('create:mechanical_plough', 2)
	machine('thermal:device_tree_extractor', 1, 'minecraft:bucket')
	machine('thermal:dynamo_stirling', 1, 'thermal:rf_coil')
	machine('create:andesite_funnel', 4)
	machine('create:andesite_tunnel', 4)
}

function tier1a(event) {
  event.shaped('kubejs:sealed_mechanism', [
		'SCS'
	], {
		C: 'kubejs:kinetic_mechanism',
		S: 'thermal:cured_rubber'
	})

  event.shaped('kubejs:copper_machine', [
		' S ',
		'SCS',
		' S '
	], {
		C: 'create:copper_casing',
		S: 'kubejs:sealed_mechanism'
	}).id('kubejs:copper_machine')

  let machine = (id, amount, other_ingredient) => {
		event.remove({ output: id })
		if (other_ingredient) {
			event.smithing(Item.of(id, amount), 'kubejs:copper_machine', other_ingredient)
			event.recipes.createMechanicalCrafting(Item.of(id, amount), "AB", { A: 'kubejs:copper_machine', B: other_ingredient })
		}
		else
			event.stonecutting(Item.of(id, amount), 'kubejs:copper_machine')
	}

  machine('create:copper_backtank', 1, '#forge:storage_blocks/copper')
	machine('create:portable_fluid_interface', 2)
	machine('create:spout', 1, 'minecraft:hopper')
	//machine('thermal:upgrade_augment_1', 1, MC('redstone'))
	machine('create:hose_pulley', 1)
	machine('create:item_drain', 1, 'minecraft:iron_bars')
	machine('thermal:dynamo_magmatic', 1, 'thermal:rf_coil')
	machine('thermal:device_water_gen', 1, 'minecraft:bucket')
	machine('create:smart_fluid_pipe', 2)
}

function tier2(event) {
  //create mill + sky stone = sky stone dust + sky stone
  event.recipes.createMilling(['ae2:sky_stone_block', 'ae2:sky_dust'], 'ae2:sky_stone_block').id('kubejs:infini_sky_dust')
  //grow certus quartz from seed
  let grow = (from, via, to) => {
		event.recipes.createSequencedAssembly([to], from, [
			event.recipes.createFilling(via, [via, Fluid.of("minecraft:water", 250)]),
		]).transitionalItem(via)
			.loops(4)
			.id('kubejs:grow_' + to.split(':')[1])
	}

  grow("ae2:certus_crystal_seed", 'kubejs:growing_certus_seed', 'kubejs:tiny_certus_crystal')
  grow("kubejs:tiny_certus_crystal", 'kubejs:growing_tiny_certus_crystal', 'kubejs:small_certus_crystal')
  grow("kubejs:small_certus_crystal", 'kubejs:growing_small_certus_crystal', 'ae2:certus_quartz_crystal')

  event.recipes.createMechanicalCrafting(Item.of('ae2:certus_crystal_seed', 2), ['A'], { A: 'ae2:certus_quartz_crystal' })
  //replace ae2 charger with create additions tesla coil
  //TODO maybe increase crafting cost of AE2 charger?
  event.remove({output: 'ae2:charger'})
  //TODO decrease charging cost at Tesla Coil from 10k FE to 5k FE
  //create mix + charged certus quartz + sky stone dust + water = destabilized redstone + certus quartz
  event.recipes.createMixing([Fluid.of('thermal:redstone', 200), 'ae2:certus_quartz_crystal'], [Fluid.of('minecraft:water', 1000), 'ae2:charged_certus_quartz_crystal', 'ae2:sky_dust']).id('kubejs:charged_sky_solution')
  //create mix + destab redstone + nether quartz = rose quartz
  event.recipes.createMixing('create:rose_quartz', ['#forge:gems/quartz', Fluid.of('thermal:redstone', 100)]).id('kubejs:mixed_rose_quartz')

  event.remove({id: 'create:sequenced_assembly/precision_mechanism'})
  let transitional = 'create:incomplete_precision_mechanism'
	event.recipes.createSequencedAssembly([
		'create:precision_mechanism',
	], 'kubejs:kinetic_mechanism', [
		event.recipes.createDeploying(transitional, [transitional, 'create:electron_tube']),
		event.recipes.createDeploying(transitional, [transitional, 'create:electron_tube']),
		event.recipes.createDeploying(transitional, [transitional, '#forge:tools/screwdriver'])
	]).transitionalItem(transitional)
		.loops(1)
		.id('kubejs:precision_mechanism')

    event.shaped('kubejs:brass_machine', [
  		' S ',
  		'SCS',
  		' S '
  	], {
  		C: 'create:brass_casing',
  		S: 'create:precision_mechanism'
  	}).id('kubejs:brass_machine')

  	let machine = (id, amount, other_ingredient) => {
  		event.remove({ output: id })
  		if (other_ingredient) {
  			event.smithing(Item.of(id, amount), 'kubejs:brass_machine', other_ingredient)
  			event.recipes.createMechanicalCrafting(Item.of(id, amount), "AB", { A: 'kubejs:brass_machine', B: other_ingredient })
  		}
  		else
  			event.stonecutting(Item.of(id, amount), 'kubejs:brass_machine')
  	}

  	machine('create:mechanical_crafter', 3, 'minecraft:crafting_table')
  	machine('create:sequenced_gearshift', 2)
  	machine('create:rotation_speed_controller', 1)
  	machine('create:mechanical_arm', 1)
  	machine('create:stockpile_switch', 2)
  	machine('create:content_observer', 2)
  	machine('thermal:machine_press', 1, 'minecraft:dropper')
  	// machine('torchmaster:feral_flare_lantern', 1, MC('glowstone_dust'))
  	machine('thermal:dynamo_numismatic', 1, 'thermal:rf_coil')
  	// machine(PP('item_terminal'), 1, TE('diamond_gear'))
  	// machine(PP('pressurizer'), 1, CR('propeller'))
  	machine('create:brass_funnel', 4)
  	machine('create:brass_tunnel', 4)
    machine('create:display_link', 1)
    machine('create:redstone_link', 2)
  	// machine('kubejs:pipe_module_tier_1', 4)
}

onEvent('recipes', event => {
	// Change recipes here
  unify(event)
  renewable_ores(event)
  ender_pearl(event)
  teleportation_core(event)
  tier1(event) //Kinetic Mechanism/Andesite Machine
  tier1a(event) //Sealed Mechanism/Copper Machine
  tier2(event) //Precision Mechanism/Brass Machine
})

onEvent('item.tags', event => {
  saws.forEach((saw) => {
    event.get('forge:saws').add('kubejs:' + saw.name.toLowerCase() + '_saw')
  });

  const mechanisms = ['kubejs:kinetic_mechanism', 'kubejs:sealed_mechanism', 'create:precision_mechanism']
  const machine_blocks = ['kubejs:andesite_machine', 'kubejs:copper_machine', 'kubejs:brass_machine']

  const groupTag = (group, item) => {
    event.add(group, item)
    const iTag = item.split(':')[1].split('_')[0]
    event.add(group + '/' + iTag, item)
  }

  mechanisms.forEach(mech => {
    groupTag('kubejs:mechanisms', mech)
  })

  machine_blocks.forEach(mach => {
    groupTag('kubejs:machine_blocks', mach)
  })
})
