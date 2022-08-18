// priority: 0

onEvent('item.registry', event => {
  let saws = [
    {name: 'Stone', material: '#forge:stone', uses: 64},
    {name: 'Iron', material: '#forge:ingots/iron', uses: 512},
    {name: 'Diamond', material: '#forge:gems/diamond', uses: 4096}
  ]

  saws.forEach((saw) => {
    let id = saw.name.toLowerCase()
    event.create(id + '_saw').texture('kubejs:item/' + id + '_saw').displayName(saw.name + ' Saw').maxDamage(saw.uses)
  })

	let growingCrystal = (e) => {
		let id = e.toLowerCase()
		event.create('growing_' + id + '_seed', 'create:sequenced_assembly').texture("ae2:item/crystal_seed_" + id).displayName(e + ' Quartz Seed')
		event.create('tiny_' + id + '_crystal').texture("ae2:item/crystal_seed_" + id + "2").displayName('Tiny ' + e + ' Quartz Crystal')
		event.create('growing_tiny_' + id + '_crystal', 'create:sequenced_assembly').texture("ae2:item/crystal_seed_" + id + "2").displayName('Tiny ' + e + ' Quartz Crystal')
		event.create('small_' + id + '_crystal').texture("ae2:item/crystal_seed_" + id + "3").displayName('Small ' + e + ' Quartz Crystal')
		event.create('growing_small_' + id + '_crystal', 'create:sequenced_assembly').texture("ae2:item/crystal_seed_" + id + "3").displayName('Small ' + e + ' Quartz Crystal')
	}

  growingCrystal('Certus')

  let mechanism = (name, rarity) => {
    let id = name.toLowerCase()
  	event.create(id + '_mechanism').texture("kubejs:item/" + id + "_mechanism").displayName(name + ' Mechanism').rarity(rarity ? rarity : RARITY_COMMON)
  	event.create('incomplete_' + id + '_mechanism', 'create:sequenced_assembly').texture("kubejs:item/incomplete_" + id + "_mechanism").displayName('Incomplete ' + name + ' Mechanism')
  }

  mechanism('Kinetic') //andesite
  mechanism('Sealed') //copper
})

onEvent('block.registry', event => {
  let machine = (name, layer) => {
    let id = name.toLowerCase()
    event.create(id + '_machine')
      .model('kubejs:block/' + id + '_machine')
      .material('lantern')
      .hardness(3.0)
      .displayName(name + ' Machine')
      .notSolid()
      .renderType(layer)
}

  machine('Andesite', 'solid')
  machine('Copper', 'cutout')
  machine('Brass', 'translucent')
})
