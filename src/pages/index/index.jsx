import {Component} from 'react'
import {Button, View} from '@tarojs/components'
import Calendar from "nick-custom-calendar-taro";
import {AtToast} from 'taro-ui'
import {
  isMonday,
  isWednesday,
  isFriday,
  isBefore,
  isSameDay, isPast, isAfter, format, addDays
} from 'date-fns'
import './index.less'

export default class Index extends Component {

  dateInfosTimeout = null

  currentDateInfo = []

  calendarRef

  state = {
    marks: [
      // {value: '2022-09-24', color: 'red', markSize: '9px'},
      // {value: '2021-06-12', color: 'pink', markSize: '9px'},
      // {value: '2021-06-13', color: 'gray', markSize: '9px'},
      // {value: '2021-06-14', color: 'yellow', markSize: '9px'},
      // {value: '2021-06-15', color: 'darkblue', markSize: '9px'},
      // {value: '2021-06-16', color: 'pink', markSize: '9px'},
      // {value: '2021-06-17', color: 'green', markSize: '9px'},
    ],
    isOpened: false,
    text: '',
    currentSelect: {
      start: '',
      end: ''
    }
  }

  componentWillMount() {
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  componentDidShow() {
  }

  componentDidHide() {
  }

  isDateValid = (date) => {
    return isMonday(date) || isWednesday(date) || isFriday(date)
  }

  debounceSetMarks = () => {
    clearTimeout(this.dateInfosTimeout)
    this.dateInfosTimeout = setTimeout(() => {
      this.setState({
        marks: this.currentDateInfo
      })
    }, 500)
  }

  handleClick = () => {
    console.log('forceUpdate')
    // this.setState({
    //   marks: this.currentDateInfo
    // })
  }

  handleCustomStyleGenerator = (dateInfo) => {
    let style = {
      extraInfoStyle: {
        position: "absolute",
        fontSize: "0.5rem",
        right: "-0.8rem",
        top: "0",
      },
      dateStyle: {},
      markStyle: {
        top: "auto",
        bottom: "0",
        right: "50%",
        transform: "translateX(50%)",
      },
    }
    const today = Date.now()
    const current = new Date(dateInfo.fullDateStr)
    if (this.isDateValid(current)) {
      this.currentDateInfo = [...this.currentDateInfo, {
        value: dateInfo.fullDateStr,
        color: 'red',
        markSize: '9px'
      }]
      this.debounceSetMarks()
    }
    if (isBefore(current, today) && !isSameDay(current, today)) {
      style.dateStyle = {
        ...style.dateStyle,
        'color': '#e2e5e8'
      }
    }
    return style;
  }

  handleCanSelectDay = (v) => {
    const selected = new Date(v.value)
    const today = Date.now()
    if (isBefore(selected, today) && !isSameDay(selected, today)) {
      return false
    }
    return true
  }

  handleMonthChange = () => {
    // TODO: 这里可以缓存
    console.log('handleMonthChange')
    this.currentDateInfo = []
  }

  handleDayClick = (v) => {
    this.setState({
      isOpened: false,
      text: ''
    })
    const start = this.state.currentSelect.start
    // if start is empty string, it is when user tap the begin of the selected range, we do nothing
    if (start === "") {
      this.setState({
        currentSelect: {
          start: v.value,
          end: ''
        }
      })
      return
    }

    const end = this.state.currentSelect.end
    // if end is not empty string ,it is the beginning of the next selected range, we do nothing
    if (end !== "") {
      this.setState({
        currentSelect: {
          start: v.value,
          end: ''
        }
      })
      return
    }

    const startDate = new Date(start)
    let current, endDate
    if (startDate > new Date(v.value)) {
      current = new Date(v.value)
      endDate = startDate
      this.setState({
        currentSelect: {
          start: v.value,
          end: this.state.currentSelect.start
        }
      })
    } else {
      current = startDate
      endDate = new Date(v.value)
      this.setState({
        currentSelect: {
          start: this.state.currentSelect.start,
          end: v.value
        }
      })
    }
    // console.log(v, current, endDate)
    let t = ""
    while (!isAfter(current, endDate)) {
      t += `${format(current, 'yyyy年MM月dd日')},`
      console.log(t)
      current = addDays(current, 1)
    }
    t = t.slice(0, -1)
    this.setState({
      isOpened: true,
      text: t,
    })
    setTimeout(() => {
      this.setState({
        isOpened: false,
        text: ""
      })
    }, 2000)
  }

  render() {
    return (
      <View className='index'>
        <Calendar
          isMultiSelect
          extraInfo={[]}
          marks={this.state.marks}
          onClickPre={this.handleMonthChange}
          onClickNext={this.handleMonthChange}
          onDayLongPress={(item) => console.log(item)}
          selectedDateColor="#346fc2"
          customStyleGenerator={this.handleCustomStyleGenerator}
          onMonthChange={this.handleMonthChange}
          canSelectDay={this.handleCanSelectDay}
          onDayClick={this.handleDayClick}
          bindRef={(ref) => {
            this.calendarRef = ref
          }}
        />
        <AtToast isOpened={this.state.isOpened} text={this.state.text}></AtToast>
      </View>
    )
  }
}
