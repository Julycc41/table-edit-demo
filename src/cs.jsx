import { Button, Input } from 'antd'
import 'antd/dist/antd.css'
import { useEffect, useState } from 'react'
function AddReceive() {
  const createExperienceShopList = () => {}
  const [value, setValue] = useState('')
  const [map, setMap] = useState()

  // const form = useRef();
  useEffect(() => {
    // 3. 创建地图实例,默认就会去找id的元素
    var map = new window.BMap.Map('container')
    setMap(map)
    // 4. 设置中心点坐标
    var point = new window.BMap.Point(116.404, 39.915)
    // 地图初始化，同时设置地图展示级别
    map.centerAndZoom(point, 6)
    // 开启鼠标滚轮缩放
    map.enableScrollWheelZoom(true)
    // 鼠标点击地图获取地址
    var geoc = new window.BMap.Geocoder()
    // 创建城市选择控件
    var cityControl = new window.BMap.CityListControl({
      // 控件的停靠位置（可选，默认左上角）
      anchor: window.BMAP_ANCHOR_TOP_LEFT,
      // 控件基于停靠位置的偏移量（可选）
      offset: new window.BMap.Size(10, 5)
    })
    // 将控件添加到地图上
    map.addControl(cityControl)
    map.addEventListener('click', function (e) {
      var pt = e.point
      geoc.getLocation(pt, function (rs) {
        var addComp = rs.addressComponents
        alert(addComp.province + ', ' + addComp.city + ', ' + addComp.district + ', ' + addComp.street + ', ' + addComp.streetNumber)
      })
    })
  }, [])

  var ac = new window.BMap.Autocomplete({
    //建立一个自动完成的对象
    input: 'suggestId',
    location: map
  })
  function G(id) {
    return document.getElementById(id)
  }

  ac.addEventListener('onhighlight', function (e) {
    //鼠标放在下拉列表上的事件
    var str = ''
    var _value = e.fromitem.value
    var value = ''
    if (e.fromitem.index > -1) {
      value = _value.province + _value.city + _value.district + _value.street + _value.business
    }
    str = 'FromItem<br />index = ' + e.fromitem.index + '<br />value = ' + value

    value = ''
    if (e.toitem.index > -1) {
      _value = e.toitem.value
      value = _value.province + _value.city + _value.district + _value.street + _value.business
    }
    str += '<br />ToItem<br />index = ' + e.toitem.index + '<br />value = ' + value
    G('searchResultPanel').innerHTML = str
  })

  var myValue
  ac.addEventListener('onconfirm', function (e) {
    //鼠标点击下拉列表后的事件
    var _value = e.item.value
    myValue = _value.province + _value.city + _value.district + _value.street + _value.business
    G('searchResultPanel').innerHTML = 'onconfirm<br />index = ' + e.item.index + '<br />myValue = ' + myValue

    setPlace()
  })

  function setPlace() {
    map.clearOverlays() //清除地图上所有覆盖物
    function myFun() {
      var pp = local.getResults().getPoi(0).point //获取第一个智能搜索的结果
      map.centerAndZoom(pp, 18)
      map.addOverlay(new window.BMap.Marker(pp)) //添加标注
    }
    var local = new window.BMap.LocalSearch(map, {
      //智能搜索
      onSearchComplete: myFun
    })
    local.search(myValue)
  }

  return (
    <div>
      <div className="add-experience-shop-list-header">
        <Button onClick={createExperienceShopList}>保存</Button>
      </div>
      <Input id="suggestId" onChange={e => setValue(e.target.value)} value={value} />
      <div id="container" style={{ width: '900px', height: '900px' }}></div>
    </div>
  )
}

export default AddReceive
